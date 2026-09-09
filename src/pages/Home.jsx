import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

import Navbar from "@/components/cotizador/Navbar";
import HeroSection from "@/components/cotizador/HeroSection";
import StepHeader from "@/components/cotizador/StepHeader";
import Sidebar from "@/components/cotizador/Sidebar";
import Footer from "@/components/cotizador/Footer";
import FAQ from "@/components/cotizador/FAQ";
import SuccessScreen from "@/components/cotizador/SuccessScreen";

import StepProducto from "@/components/cotizador/steps/StepProducto";
import StepEntrada from "@/components/cotizador/steps/StepEntrada";
import StepContacto from "@/components/cotizador/steps/StepContacto";
import StepResumen from "@/components/cotizador/steps/StepResumen";

const supabase = createClient(
  "https://jeeqyynfurdeitnisupi.supabase.co",
  "sb_publishable_F2CXviXhqqaN3zz63sp4mw_sqHnC-wE"
);

// ---------------------------------------------------------------
// Atribucion publicitaria.
//
// Meta agrega fbclid y las UTM a la URL de destino. Se leen UNA vez
// al cargar y se guardan en sessionStorage, porque la persona puede
// navegar o recargar antes de enviar y ahi la URL ya perdio los
// parametros.
//
// Queda en la tabla (donde se necesita) y ademas gclid/fbclid van al
// pie del mensaje de WhatsApp, para poder seguir el creativo que trajo
// al lead. El resto del tracking va por el dataLayer (ver /tracking.js).
// ---------------------------------------------------------------
const CLAVE_ATRIB = "suplacard_atribucion";

const capturarAtribucion = () => {
  try {
    const p = new URLSearchParams(window.location.search);
    const campos = ["fbclid", "gclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const nuevo = {};
    campos.forEach((c) => { const v = p.get(c); if (v) nuevo[c] = v; });

    // Solo pisa lo guardado si esta visita trae parametros nuevos.
    if (Object.keys(nuevo).length > 0) {
      nuevo.landing_url = window.location.href.slice(0, 2000);
      nuevo.referrer = document.referrer ? document.referrer.slice(0, 500) : null;
      sessionStorage.setItem(CLAVE_ATRIB, JSON.stringify(nuevo));
      return nuevo;
    }
    const guardado = sessionStorage.getItem(CLAVE_ATRIB);
    return guardado ? JSON.parse(guardado) : {};
  } catch {
    return {};
  }
};

const leerAtribucion = () => {
  const a = capturarAtribucion();
  return {
    fbclid: a.fbclid || null,
    gclid: a.gclid || null,
    utm_source: a.utm_source || null,
    utm_medium: a.utm_medium || null,
    utm_campaign: a.utm_campaign || null,
    utm_content: a.utm_content || null,
    utm_term: a.utm_term || null,
    landing_url: a.landing_url || null,
    referrer: a.referrer || null,
  };
};

// Se ejecuta apenas carga el modulo, antes de que la persona navegue.
if (typeof window !== "undefined") capturarAtribucion();

// Las mismas fotos de los carruseles de suplacard.com.
// Placards tiene 7 en el sitio; cocinas y vestidores, 8.
// IMG tiene que declararse ANTES de usarse: en JavaScript un const
// no existe hasta su linea, y usarlo antes tumba la app entera.
const IMG = "https://www.suplacard.com/img";
const HERO_IMG = `${IMG}/hero.jpg`;
const PRODUCT_IMAGES = {
  Placard:  Array.from({ length: 7 }, (_, i) => `${IMG}/placard-0${i + 1}.jpg`),
  Vestidor: Array.from({ length: 8 }, (_, i) => `${IMG}/vestidor-0${i + 1}.jpg`),
  Cocina:   Array.from({ length: 8 }, (_, i) => `${IMG}/cocina-0${i + 1}.jpg`),
};

const generateCodigo = () => {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `SUP-${year}-${code}`;
};

const formatWhatsApp = (num) => {
  if (!num) return "";
  const digits = num.replace(/\D/g, "");
  if (digits.length >= 8) {
    const area = digits.slice(0, -8);
    const main = digits.slice(-8);
    return `${area} ${main.slice(0, 4)}-${main.slice(4)}`.trim();
  }
  return num;
};

// Subir archivo a Supabase Storage
const uploadFile = async (file, codigo) => {
  const ext = file.name.split(".").pop();
  const path = `consultas/${codigo}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("archivos")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from("archivos").getPublicUrl(path);
  return urlData.publicUrl;
};

const TOTAL_STEPS = 4;
const CONTACTO_STEP = 3;
const RESUMEN_STEP = 4;

export default function Home() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({ productos: [], configs: {} });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const cotizadorRef = useRef(null);
  // Candado: garantiza que el evento Lead salga UNA sola vez por
  // consulta, aunque el usuario toque dos veces o React reintente.
  const leadEnviadoRef = useRef(false);

  const scrollToCotizador = useCallback(() => {
    cotizadorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goTo = useCallback((n) => {
    setStep(n);
    setTimeout(() => {
      cotizadorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!state.productos || state.productos.length === 0)
        errs.productos = "Elegí al menos un producto";
    } else if (step === 2) {
      (state.productos || []).forEach((p) => {
        const config = state.configs?.[p] || {};
        if (!config.entrada) { errs[p] = errs[p] || {}; errs[p].entrada = "Elegí una opción"; }
        else if (config.entrada === "Tengo planos") {
          if (!files[p] || files[p].length === 0) { errs[p] = errs[p] || {}; errs[p].archivos = "Adjuntá al menos un archivo"; }
        } else if (config.entrada === "Tengo medidas/fotos") {
          if (!config.ancho || !config.alto || !config.profundidad) { errs[p] = errs[p] || {}; errs[p].medidas = "Completá todas las medidas"; }
        } else if (config.entrada === "No tengo nada") {
          if (!config.medidaAprox || !config.ambiente) { errs[p] = errs[p] || {}; errs[p].nada = "Completá los campos obligatorios"; }
        }
      });
    } else if (step === CONTACTO_STEP) {
      if (!state.nombre?.trim()) errs.nombre = "Ingresá tu nombre";
      if (!state.whatsapp?.trim()) errs.whatsapp = "Ingresá tu WhatsApp";
    }
    return errs;
  };

  const buildMensaje = (codigo, clickId, atribucion) => {
    const productos = state.productos || [];
    const configs = state.configs || {};
    const attr = atribucion || {};
    const lines = [];

    lines.push("🛋️ *Nueva consulta — SUPLACARD*");
    lines.push("━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("👤 *CLIENTE*");
    if (state.nombre) lines.push(`🧑 ${state.nombre}`);
    if (state.whatsapp) lines.push(`📱 ${formatWhatsApp(state.whatsapp)}`);
    if (state.email) lines.push(`📧 ${state.email}`);
    if (state.localidad) lines.push(`📍 ${state.localidad}`);
    const obraUrgencia = [state.obra, state.urgencia].filter(Boolean).join(" · ");
    if (obraUrgencia) lines.push(`🏗️ ${obraUrgencia}`);

    productos.forEach((p, idx) => {
      const cfg = configs[p] || {};
      lines.push("");
      lines.push(`📦 *PRODUCTO ${idx + 1}: ${p}*`);
      if (cfg.entrada) lines.push(`🔹 ${cfg.entrada}`);
      if (cfg.entrada === "Tengo medidas/fotos") {
        const parts = [];
        if (cfg.alto) parts.push(`Alto: ${cfg.alto}${cfg.altoUnidad || "cm"}`);
        if (cfg.ancho) parts.push(`Ancho: ${cfg.ancho}${cfg.anchoUnidad || "cm"}`);
        if (cfg.profundidad) parts.push(`Prof: ${cfg.profundidad}${cfg.profundidadUnidad || "cm"}`);
        if (parts.length) lines.push(`📐 ${parts.join(" · ")}`);
      }
      if (cfg.entrada === "No tengo nada") {
        if (cfg.medidaAprox) lines.push(`📐 Medida aprox.: ${cfg.medidaAprox}`);
        if (cfg.ambiente) lines.push(`🏠 Ambiente: ${cfg.ambiente}`);
      }
      const desc = cfg.descripcion || cfg.descripcionNada;
      if (desc) lines.push(`📝 ${desc}`);
      if (files[p] && files[p].length > 0) lines.push(`📎 ${files[p].length} archivo/s adjunto/s`);
    });

    if (state.comentarios) {
      lines.push("");
      lines.push(`💬 *Comentarios:* ${state.comentarios}`);
    }

    lines.push("");
    lines.push("━━━━━━━━━━━━━━");
    lines.push(`🔖 *ID:* ${codigo}`);
    lines.push(`🔗 Ver detalle completo con fotos, planos y referencias:`);
    lines.push(`https://forms.suplacard.com/consulta/${codigo}`);
    lines.push(`✅ Los archivos pueden descargarse desde el enlace`);

    // Pie de seguimiento (estilo lp.suplacard.com): click_id + gclid/fbclid
    // solo si vinieron de un anuncio. Sirve para atribuir el creativo que
    // trajo al lead. Si no vino de ads, queda solo el ref con el click_id.
    const refParts = [codigo];
    if (clickId && clickId !== codigo) refParts.push(clickId);
    if (attr.gclid) refParts.push(`gclid:${attr.gclid}`);
    if (attr.fbclid) refParts.push(`fbclid:${attr.fbclid}`);
    lines.push("");
    lines.push(`(ref: ${refParts.join(" · ")})`);

    return lines.join("\n");
  };

  const handleNext = async () => {
    const errs = validateStep();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    if (step === RESUMEN_STEP) {
      if (sending) return;
      setSending(true);

      // El popup se pide ANTES de cualquier await: si se pide despues,
      // el navegador ya no lo asocia al clic y lo bloquea siempre.
      const popup = window.open("", "_blank");

      // El codigo se genera una sola vez, fuera del try. Antes se
      // volvia a generar en el catch y quedaba uno distinto del que
      // se habia usado para subir los archivos.
      const codigo = generateCodigo();
      const productos = state.productos || [];
      const configs = state.configs || {};
      const atribucion = leerAtribucion();

      // click_id de sesion (compartido por todos los envios de la visita).
      // Va en el evento del dataLayer y en el pie del mensaje de WhatsApp,
      // para que Google Ads (orderId) y Kapso puedan matchear el lead.
      const clickId =
        (window.SuplacardTracking && window.SuplacardTracking.getClickId()) || codigo;

      // ---------------------------------------------------------------
      // Conversion. Centralizada en GTM (GTM-PWKQQHVP).
      //
      // Tiene que dispararse ANTES de mandar el navegador a WhatsApp.
      // Si el popup viene bloqueado (lo normal en celular) se usa
      // window.location.href y la pagina se va: todo lo que este
      // despues de esa linea no llega a ejecutarse nunca.
      //
      // Empujamos UN solo evento `whatsapp_click` al dataLayer (mismo
      // esquema que lp.suplacard.com). GTM se encarga de disparar el
      // Lead de Meta (25867), la conversion de Google Ads y GA4. No se
      // llama a fbq/gtag directo desde aca: asi no hay pixel duplicado
      // ni logica de medicion repartida entre el codigo y el contenedor.
      // ---------------------------------------------------------------
      const dispararLead = () => {
        if (leadEnviadoRef.current) return;
        leadEnviadoRef.current = true;

        try {
          if (window.SuplacardTracking &&
              typeof window.SuplacardTracking.trackWhatsAppClick === "function") {
            window.SuplacardTracking.trackWhatsAppClick({
              entryPoint: "cotizador",
              kwCode: codigo,
              context: productos.join(", "),
              phone: state.whatsapp,
            });
          } else if (window.dataLayer) {
            // Fallback si tracking.js no cargo: mismo evento, esquema minimo.
            window.dataLayer.push({
              event: "whatsapp_click",
              wa_click_id: clickId,
              wa_entry_point: "cotizador",
              wa_kw_code: codigo,
              fbclid: atribucion.fbclid,
              gclid: atribucion.gclid,
              utm_source: atribucion.utm_source,
              utm_campaign: atribucion.utm_campaign,
              utm_content: atribucion.utm_content,
              utm_term: atribucion.utm_term,
            });
          }
        } catch (err) { console.warn("[Suplacard] whatsapp_click:", err); }
      };

      const abrirWhatsApp = () => {
        const msg = buildMensaje(codigo, clickId, atribucion);
        const url = `https://wa.me/5491151359303?text=${encodeURIComponent(msg)}`;
        if (popup) popup.location.href = url;
        else window.location.href = url;
      };

      try {
        // Subir archivos a Supabase Storage
        const fileUrls = [];
        for (const [, fileList] of Object.entries(files)) {
          for (const file of fileList) {
            try {
              const url = await uploadFile(file, codigo);
              fileUrls.push(url);
            } catch (e) { console.warn("Error subiendo archivo:", e); }
          }
        }

        const medidasParts = productos.map((p) => {
          const cfg = configs[p] || {};
          if (cfg.entrada === "Tengo medidas/fotos")
            return `${p}: ${cfg.alto || "-"}${cfg.altoUnidad || "cm"} x ${cfg.ancho || "-"}${cfg.anchoUnidad || "cm"} x ${cfg.profundidad || "-"}${cfg.profundidadUnidad || "cm"}`;
          if (cfg.entrada === "No tengo nada")
            return `${p}: aprox. ${cfg.medidaAprox || "-"} (${cfg.ambiente || "-"})`;
          return null;
        }).filter(Boolean);

        const descripcionParts = productos.map((p) => {
          const cfg = configs[p] || {};
          const desc = cfg.descripcion || cfg.descripcionNada;
          return desc ? `${p}: ${desc}` : null;
        }).filter(Boolean);

        // Guardar en Supabase
        const { error: errInsert } = await supabase.from("quotes").insert({
          codigo,
          producto: productos.join(", "),
          entrada: productos.map((p) => configs[p]?.entrada).filter(Boolean).join(", "),
          medidas: medidasParts.join(" | "),
          descripcion: descripcionParts.join(" | "),
          archivos: fileUrls,
          nombre: state.nombre,
          whatsapp: state.whatsapp,
          email: state.email || "",
          localidad: state.localidad || "",
          obra: state.obra || "",
          urgencia: state.urgencia || "",
          comentarios: state.comentarios || "",
          extra_fields: { configs },
          status: "enviado",
          ...atribucion,
        });

        if (errInsert) throw errInsert;

        dispararLead();
        abrirWhatsApp();
        setSent(true);
      } catch (e) {
        // El guardado fallo. Se abre WhatsApp igual, porque perder
        // al cliente es peor que perder el registro. Pero ANTES se
        // deja rastro: sin esto el fallo es invisible y la tabla
        // queda vacia sin que nadie se entere, que es exactamente
        // lo que ya paso una vez.
        console.error("[Suplacard] Fallo el guardado de la consulta:", e);

        try {
          // Copia local recuperable a mano si hace falta.
          const pendientes = JSON.parse(localStorage.getItem("suplacard_no_guardadas") || "[]");
          pendientes.push({ codigo, fecha: new Date().toISOString(), state, atribucion, error: String(e) });
          localStorage.setItem("suplacard_no_guardadas", JSON.stringify(pendientes.slice(-20)));
        } catch { /* si ni esto anda, seguimos igual */ }

        // Evento para poder alertar desde GTM.
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "error_guardado_consulta",
            codigo,
            detalle: String(e).slice(0, 300),
          });
        }

        // El lead existe igual: el cliente entra por WhatsApp aunque
        // la fila no se haya guardado. Si no se contara aca, Meta
        // veria menos conversiones de las reales.
        dispararLead();
        abrirWhatsApp();
        setSent(true);
      } finally {
        setSending(false);
      }
      return;
    }

    if (step < RESUMEN_STEP) goTo(step + 1);
  };

  const handlePrev = () => { if (step > 1) goTo(step - 1); };

  const handleReset = () => {
    setState({ productos: [], configs: {} });
    setFiles({});
    setErrors({});
    setSent(false);
    setStep(1);
    leadEnviadoRef.current = false;
    setTimeout(() => cotizadorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const isResumenStep = step === RESUMEN_STEP;

  const renderStep = () => {
    if (sent) return <SuccessScreen producto={(state.productos || []).join(", ")} onReset={handleReset} />;
    if (step === 1) return <StepProducto state={state} setState={setState} images={PRODUCT_IMAGES} errors={errors} />;
    if (step === 2) return <StepEntrada state={state} setState={setState} files={files} setFiles={setFiles} errors={errors} />;
    if (step === CONTACTO_STEP) return <StepContacto state={state} setState={setState} errors={errors} />;
    if (isResumenStep) return <StepResumen state={state} files={files} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar onCotizar={scrollToCotizador} />
      <HeroSection heroImage={HERO_IMG} onStart={scrollToCotizador} />
      <section ref={cotizadorRef} className="scroll-mt-20 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="border border-black/8 bg-white rounded-sm overflow-hidden">
            {!sent && <StepHeader currentStep={step} totalSteps={TOTAL_STEPS} />}
            <div className="px-6 sm:px-8 py-7">
              <AnimatePresence mode="wait">
                <motion.div key={sent ? "success" : step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
            {!sent && (
              <div className="grid grid-cols-2 gap-3 px-6 sm:px-8 py-5 border-t border-black/5">
                <button onClick={handlePrev} disabled={step === 1} className="flex items-center justify-start gap-2 h-11 px-5 rounded-full border border-black/10 text-[13px] font-medium text-[#151515] hover:border-[#151515] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={15} /> Anterior
                </button>
                <button onClick={handleNext} disabled={sending} className="flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#151515] text-white text-[13px] font-medium hover:bg-[#333333] transition-colors disabled:opacity-60 disabled:cursor-wait">
                  {sending ? "Enviando..." : isResumenStep ? "Enviar consulta" : "Siguiente"} {!sending && <ChevronRight size={15} />}
                </button>
              </div>
            )}
          </div>
          <div className="hidden lg:block lg:sticky lg:top-20">
            <Sidebar state={state} currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </div>
  );
}
