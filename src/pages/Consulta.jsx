import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";
import { FileText, Loader2, Download, ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";

const supabase = createClient(
  "https://jeeqyynfurdeitnisupi.supabase.co",
  "sb_publishable_F2CXviXhqqaN3zz63sp4mw_sqHnC-wE"
);

export default function Consulta() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        // Buscar por codigo (SUP-2026-XXXX)
        let { data, error: err } = await supabase
          .from("quotes")
          .select("*")
          .eq("codigo", id)
          .single();

        // Fallback por ID
        if (err || !data) {
          const { data: data2, error: err2 } = await supabase
            .from("quotes")
            .select("*")
            .eq("id", id)
            .single();
          if (err2 || !data2) throw new Error("Consulta no encontrada");
          data = data2;
        }

        setQuote(data);
      } catch (e) {
        setError(e.message || "No se pudo cargar la consulta");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#B38B67]" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center pt-40 pb-20 px-5 text-center">
        <p className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#151515] mb-3">
          Consulta no encontrada
        </p>
        <p className="text-[14px] text-[#151515]/50 mb-6 max-w-[40ch]">
          {error || "El link no es válido o la consulta fue eliminada."}
        </p>
        <a href="/" className="h-12 px-6 inline-flex items-center rounded-full bg-[#151515] text-white text-[14px] font-medium hover:bg-[#B38B67] transition-colors">
          Volver al inicio
        </a>
      </div>
    );
  }

  const archivos = quote.archivos || [];
  const configs = quote.extra_fields?.configs || {};
  const productos = (quote.producto || "").split(", ").filter(Boolean);
  const images = archivos.filter((url) => url.match(/\.(jpg|jpeg|png|webp|gif|bmp)$/i));
  const pdfs = archivos.filter((url) => url.match(/\.pdf$/i));
  const otherFiles = archivos.filter((url) => !url.match(/\.(jpg|jpeg|png|webp|gif|bmp|pdf)$/i));

  const fileName = (url) => {
    try {
      const parts = new URL(url).pathname.split("/");
      return decodeURIComponent(parts[parts.length - 1]) || "archivo";
    } catch {
      return url.split("/").pop() || "archivo";
    }
  };

  const openLightbox = (url) => {
    const idx = images.indexOf(url);
    setLightboxIdx(idx >= 0 ? idx : 0);
    setLightbox(url);
  };

  const nextImage = () => {
    const ni = (lightboxIdx + 1) % images.length;
    setLightboxIdx(ni);
    setLightbox(images[ni]);
  };

  const prevImage = () => {
    const pi = (lightboxIdx - 1 + images.length) % images.length;
    setLightboxIdx(pi);
    setLightbox(images[pi]);
  };

  const cleanPhone = (phone) => {
    let p = (phone || "").replace(/[^\d]/g, "");
    if (p.startsWith("0")) p = p.slice(1);
    if (!p.startsWith("549") && p.length === 10) p = "549" + p;
    if (p.length === 12 && p.startsWith("11")) p = "549" + p;
    return p;
  };

  const handleContactClient = () => {
    const phone = cleanPhone(quote.whatsapp);
    const msg = `Hola ${quote.nombre || ""}, soy de Suplacard. Te contacto por tu consulta ${quote.codigo ? `(${quote.codigo})` : ""} sobre ${quote.producto || "mueble a medida"}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleDownloadAll = async () => {
    if (archivos.length === 0) return;
    setDownloading(true);
    try {
      const zip = new JSZip();
      const fetches = await Promise.allSettled(
        archivos.map(async (url, i) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error("fetch failed");
          const blob = await res.blob();
          const ext = url.match(/\.([a-zA-Z0-9]+)(\?|$)/)?.[1] || "bin";
          const name = fileName(url) || `archivo_${i + 1}.${ext}`;
          return { name, blob };
        })
      );
      fetches.forEach((r) => {
        if (r.status === "fulfilled") zip.file(r.value.name, r.value.blob);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const clientName = (quote.nombre || "cliente").replace(/\s+/g, "_");
      const dateStr = new Date(quote.created_at || Date.now()).toISOString().slice(0, 10);
      a.download = `${clientName}_${dateStr}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
    } finally {
      setDownloading(false);
    }
  };

  const contact = [
    { label: "Nombre", value: quote.nombre },
    { label: "WhatsApp", value: quote.whatsapp },
    { label: "Email", value: quote.email },
    { label: "Localidad", value: quote.localidad },
    { label: "Tipo de obra", value: quote.obra },
    { label: "Urgencia", value: quote.urgencia },
  ].filter((d) => d.value);

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Top action bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-black/8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" className="shrink-0 h-9 w-9 rounded-full border border-black/10 flex items-center justify-center hover:border-[#151515] transition-colors">
              <ChevronLeft size={16} className="text-[#151515]" />
            </a>
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B38B67]">
                ID: {quote.codigo || String(id).slice(-8).toUpperCase()}
              </p>
              <p className="text-[13px] font-medium text-[#151515] truncate">
                {quote.nombre} · {quote.producto}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {archivos.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={downloading}
                className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full border border-black/10 text-[12px] font-medium text-[#151515] hover:border-[#151515] transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {downloading ? "Comprimiendo..." : "Descargar todo"}
              </button>
            )}
            <button
              onClick={handleContactClient}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#25D366] text-white text-[12px] font-medium hover:bg-[#1ebe5d] transition-colors"
            >
              💬 Contactar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#151515] mb-2">
            Detalle de la <em className="italic text-[#B38B67]">cotización.</em>
          </h1>
          <p className="text-[13px] text-[#151515]/50">
            {quote.created_at
              ? new Date(quote.created_at).toLocaleString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
              : ""}
            {" · "}Status: <span className="font-medium text-[#151515]">{quote.status || "enviado"}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="flex flex-col gap-6">
            {/* Productos */}
            <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-8">
              <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#151515]/40 mb-5">Productos y configuración</h2>
              <div className="space-y-5">
                {productos.map((p) => {
                  const cfg = configs[p] || {};
                  return (
                    <div key={p} className="border-b border-black/5 last:border-0 last:pb-0 pb-5">
                      <h3 className="font-display text-[20px] text-[#151515] mb-3">{p}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-[#151515]/40 mb-0.5">Punto de partida</span>
                          <span className="text-[14px] text-[#151515] font-medium">{cfg.entrada || quote.entrada || "-"}</span>
                        </div>
                        {cfg.entrada === "Tengo medidas/fotos" && (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[11px] text-[#151515]/40 mb-0.5">Ancho</span>
                              <span className="text-[14px] text-[#151515] font-medium">{cfg.ancho ? `${cfg.ancho} ${cfg.anchoUnidad || "cm"}` : "-"}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] text-[#151515]/40 mb-0.5">Alto</span>
                              <span className="text-[14px] text-[#151515] font-medium">{cfg.alto ? `${cfg.alto} ${cfg.altoUnidad || "cm"}` : "-"}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] text-[#151515]/40 mb-0.5">Profundidad</span>
                              <span className="text-[14px] text-[#151515] font-medium">{cfg.profundidad ? `${cfg.profundidad} ${cfg.profundidadUnidad || "cm"}` : "-"}</span>
                            </div>
                          </>
                        )}
                        {cfg.entrada === "No tengo nada" && (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[11px] text-[#151515]/40 mb-0.5">Medida aprox.</span>
                              <span className="text-[14px] text-[#151515] font-medium">{cfg.medidaAprox || "-"}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] text-[#151515]/40 mb-0.5">Ambiente</span>
                              <span className="text-[14px] text-[#151515] font-medium">{cfg.ambiente || "-"}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {(cfg.descripcion || cfg.descripcionNada) && (
                        <div className="mt-4">
                          <span className="text-[11px] text-[#151515]/40 block mb-1">Descripción</span>
                          <p className="text-[14px] text-[#151515]/70 leading-relaxed bg-[#F9F8F6] rounded-sm p-3">{cfg.descripcion || cfg.descripcionNada}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {quote.comentarios && (
                <div className="mt-5 pt-5 border-t border-black/5">
                  <span className="text-[11px] text-[#151515]/40 block mb-2">Comentarios</span>
                  <p className="text-[14px] text-[#151515]/70 leading-relaxed bg-[#F9F8F6] rounded-sm p-4">{quote.comentarios}</p>
                </div>
              )}
            </div>

            {/* Imágenes */}
            {images.length > 0 && (
              <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#151515]/40">Imágenes ({images.length})</h2>
                  <ImageIcon size={14} className="text-[#151515]/30" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((url, i) => (
                    <button key={i} onClick={() => openLightbox(url)} className="group relative aspect-square rounded-sm overflow-hidden border border-black/5 bg-[#F9F8F6]">
                      <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-start p-2">
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-white font-mono bg-black/50 px-2 py-0.5 rounded-full">{i + 1}/{images.length}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PDFs */}
            {pdfs.length > 0 && (
              <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#151515]/40">Planos / PDFs ({pdfs.length})</h2>
                  <FileText size={14} className="text-[#151515]/30" />
                </div>
                <div className="space-y-2">
                  {pdfs.map((url, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-sm border border-black/5 bg-[#F9F8F6]">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText size={20} className="text-[#B38B67] shrink-0" />
                        <span className="text-[13px] text-[#151515] truncate">{fileName(url)}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a href={url} download={fileName(url)} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/10 text-[12px] font-medium text-[#151515] hover:border-[#151515] transition-colors">
                          <Download size={13} /><span className="hidden sm:inline">Descargar</span>
                        </a>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/10 text-[12px] font-medium text-[#151515] hover:border-[#151515] transition-colors">
                          <FileText size={13} />Ver
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Otros archivos */}
            {otherFiles.length > 0 && (
              <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-8">
                <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#151515]/40 mb-5">Otros archivos ({otherFiles.length})</h2>
                <div className="space-y-2">
                  {otherFiles.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-sm border border-black/5 bg-[#F9F8F6] hover:border-[#B38B67] transition-colors">
                      <FileText size={20} className="text-[#B38B67] shrink-0" />
                      <span className="text-[13px] text-[#151515] truncate">{fileName(url)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contacto */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-7">
              <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#151515]/40 mb-5">Datos de contacto</h2>
              <div className="flex flex-col gap-4 mb-6">
                {contact.map((d) => (
                  <div key={d.label} className="flex flex-col">
                    <span className="text-[11px] text-[#151515]/40 mb-0.5">{d.label}</span>
                    <span className="text-[14px] text-[#151515] font-medium break-words">{d.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleContactClient}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#25D366] text-white text-[13px] font-medium hover:bg-[#1ebe5d] transition-colors mb-3"
              >
                💬 Contactar cliente por WhatsApp
              </button>
              {archivos.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={downloading}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full border border-black/10 text-[#151515] text-[13px] font-medium hover:border-[#151515] transition-colors disabled:opacity-50"
                >
                  {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                  {downloading ? "Comprimiendo..." : "Descargar todo (ZIP)"}
                </button>
              )}
            </div>
            {archivos.length > 0 && (
              <div className="mt-4 text-center text-[12px] text-[#151515]/40">
                {archivos.length} archivo{archivos.length !== 1 ? "s" : ""}
                {images.length > 0 && ` · ${images.length} imagen${images.length !== 1 ? "es" : ""}`}
                {pdfs.length > 0 && ` · ${pdfs.length} PDF`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10" onClick={(e) => { e.stopPropagation(); setLightbox(null); }}>
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button className="absolute left-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                <ChevronLeft size={24} />
              </button>
              <button className="absolute right-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <img src={lightbox} alt="Vista ampliada" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/60 px-3 py-1 rounded-full bg-black/40">{lightboxIdx + 1} / {images.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
