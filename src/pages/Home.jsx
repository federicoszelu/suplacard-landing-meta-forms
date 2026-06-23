import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

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

const HERO_IMG = "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/47abdf024_generated_2021eae0.png";
const PRODUCT_IMAGES = {
  Placard: "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/b20397ae8_generated_97d04c80.png",
  Vestidor: "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/efbb631d6_generated_94d19222.png",
  Cocina: "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/958d3b006_generated_ce679a74.png",
};

const generateCodigo = () => {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SUP-${year}-${code}`;
};

const generateToken = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
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
      if (!state.productos || state.productos.length === 0) {
        errs.productos = "Elegí al menos un producto";
      }
    } else if (step === 2) {
      const productos = state.productos || [];
      productos.forEach((p) => {
        const config = state.configs?.[p] || {};
        if (!config.entrada) {
          errs[p] = errs[p] || {};
          errs[p].entrada = "Elegí una opción para continuar";
        } else if (config.entrada === "Tengo planos") {
          if (!files[p] || files[p].length === 0) {
            errs[p] = errs[p] || {};
            errs[p].archivos = "Adjuntá al menos un archivo";
          }
        } else if (config.entrada === "Tengo medidas/fotos") {
          if (!config.ancho || !config.alto || !config.profundidad) {
            errs[p] = errs[p] || {};
            errs[p].medidas = "Completá todas las medidas";
          }
        } else if (config.entrada === "No tengo nada") {
          if (!config.medidaAprox || !config.ambiente) {
            errs[p] = errs[p] || {};
            errs[p].nada = "Completá los campos obligatorios";
          }
        }
      });
    } else if (step === CONTACTO_STEP) {
      if (!state.nombre?.trim()) errs.nombre = "Ingresá tu nombre";
      if (!state.whatsapp?.trim()) errs.whatsapp = "Ingresá tu WhatsApp";
    }
    return errs;
  };

  const buildMensaje = (codigo, token) => {
    const productos = state.productos || [];
    const configs = state.configs || {};
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

      if (files[p] && files[p].length > 0) {
        lines.push(`📎 ${files[p].length} archivo/s adjunto/s`);
      }
    });

    if (state.comentarios) {
      lines.push("");
      lines.push(`💬 *Comentarios:* ${state.comentarios}`);
    }

    if (codigo) {
      lines.push("");
      lines.push("━━━━━━━━━━━━━━");
      lines.push(`🔖 *ID:* ${codigo}`);
      lines.push(`🔗 Ver detalle completo con fotos, planos y referencias:`);
      lines.push(`https://presupuestos.suplacard.com/consulta/${codigo}`);
      lines.push(`✅ Los archivos pueden descargarse desde el enlace`);
    }

    return lines.join("\n");
  };

  const handleNext = async () => {
    const errs = validateStep();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (step === RESUMEN_STEP) {
      setSending(true);
      const popup = window.open("", "_blank");
      try {
        const fileUrls = [];
        for (const [, fileList] of Object.entries(files)) {
          for (const file of fileList) {
            try {
              const { file_url } = await base44.integrations.Core.UploadFile({ file });
              fileUrls.push(file_url);
            } catch (e) {}
          }
        }

        const codigo = generateCodigo();
        const token = generateToken();
        const configs = state.configs || {};
        const productos = state.productos || [];

        const medidasParts = productos.map((p) => {
          const cfg = configs[p] || {};
          if (cfg.entrada === "Tengo medidas/fotos") {
            return `${p}: ${cfg.alto || "-"}${cfg.altoUnidad || "cm"} x ${cfg.ancho || "-"}${cfg.anchoUnidad || "cm"} x ${cfg.profundidad || "-"}${cfg.profundidadUnidad || "cm"}`;
          }
          if (cfg.entrada === "No tengo nada") {
            return `${p}: aprox. ${cfg.medidaAprox || "-"} (${cfg.ambiente || "-"})`;
          }
          return null;
        }).filter(Boolean);

        const descripcionParts = productos.map((p) => {
          const cfg = configs[p] || {};
          const desc = cfg.descripcion || cfg.descripcionNada;
          return desc ? `${p}: ${desc}` : null;
        }).filter(Boolean);

        await base44.entities.Quote.create({
          codigo,
          token,
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
        });

        const msg = buildMensaje(codigo, token);
        const url = `https://wa.me/5491151359303?text=${encodeURIComponent(msg)}`;
        if (popup) {
          popup.location.href = url;
        } else {
          window.location.href = url;
        }

        setSent(true);
      } catch (e) {
        const codigo = generateCodigo();
        const msg = buildMensaje(codigo, null);
        const url = `https://wa.me/5491151359303?text=${encodeURIComponent(msg)}`;
        if (popup) {
          popup.location.href = url;
        } else {
          window.location.href = url;
        }
        setSent(true);
      } finally {
        setSending(false);
      }
      return;
    }

    if (step < RESUMEN_STEP) goTo(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) goTo(step - 1);
  };

  const handleReset = () => {
    setState({ productos: [], configs: {} });
    setFiles({});
    setErrors({});
    setSent(false);
    setStep(1);
    setTimeout(() => {
      cotizadorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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

      <HeroSection heroImage={HERO_IMG} onStart={() => { scrollToCotizador(); }} />

      <section
        ref={cotizadorRef}
        className="scroll-mt-20 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-10 lg:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="border border-black/8 bg-white rounded-sm overflow-hidden">
            {!sent && <StepHeader currentStep={step} totalSteps={TOTAL_STEPS} />}

            <div className="px-6 sm:px-8 py-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sent ? "success" : step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {!sent && (
              <div className="grid grid-cols-2 gap-3 px-6 sm:px-8 py-5 border-t border-black/5">
                <button
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="flex items-center justify-start gap-2 h-11 px-5 rounded-full border border-black/10 text-[13px] font-medium text-[#151515] hover:border-[#151515] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} /> Anterior
                </button>
                <button
                  onClick={handleNext}
                  disabled={sending}
                  className="flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#151515] text-white text-[13px] font-medium hover:bg-[#B38B67] transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
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