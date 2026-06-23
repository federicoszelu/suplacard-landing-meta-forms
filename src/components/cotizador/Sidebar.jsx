import React from "react";
import { MessageCircle, Phone } from "lucide-react";

const PRECISION = {
  "Tengo planos": { base: 70, final: 100, text: "El plano permite validar todo: medidas, materiales y detalles." },
  "Tengo medidas/fotos": { base: 50, final: 88, text: "Medidas y fotos: precio bastante preciso." },
  "No tengo nada": { base: 20, final: 60, text: "Orientación inicial: un asesor guía el proyecto." },
};

export default function Sidebar({ state, currentStep, totalSteps }) {
  const productos = state.productos || [];
  const configs = state.configs || {};

  const firstEntrada = productos.length ? configs[productos[0]]?.entrada : null;
  const entry = firstEntrada ? PRECISION[firstEntrada] : null;
  const factor = totalSteps > 1 ? (currentStep - 1) / (totalSteps - 1) : 0;
  const meterVal = entry ? Math.round(entry.base + (entry.final - entry.base) * factor) : 0;
  const meterText = !productos.length
    ? "Elegí producto para iniciar."
    : !firstEntrada
    ? "Definí tu punto de partida."
    : entry?.text || "";

  const summaryRows = [
    { label: "Producto/s", value: productos.length ? productos.join(", ") : null },
    ...productos.map((p) => ({
      label: `${p} · entrada`,
      value: configs[p]?.entrada || null,
    })),
  ];

  return (
    <aside className="space-y-4">
      {/* Precision card */}
      <div className="bg-[#151515] text-white rounded-sm p-6">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35 mb-1.5">
          Precisión de cotización
        </p>
        <h4 className="font-display text-[24px] font-light mb-4">
          Estado del precio
        </h4>
        <div className="h-[6px] bg-white/10 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-[#B38B67] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${meterVal}%`, minWidth: meterVal > 0 ? 4 : 0 }}
          />
        </div>
        <p className="text-[13px] text-white/50 leading-relaxed mb-5">{meterText}</p>
        <div className="space-y-0">
          {summaryRows.map((r) => (
            <div
              key={r.label}
              className="flex justify-between items-center border-t border-white/8 py-2.5"
            >
              <span className="text-[13px] text-white/40">{r.label}</span>
              <span className="text-[12px] font-medium text-white text-right max-w-[55%] truncate">
                {r.value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="border border-black/8 rounded-sm p-6 bg-white">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B38B67] mb-1.5">
          Cómo funciona
        </p>
        <h4 className="font-display text-[22px] font-light mb-4">3 caminos de entrada</h4>
        <div className="space-y-3">
          {[
            { n: "01", text: "Con plano: validamos medidas y detalles técnicos." },
            { n: "02", text: "Con medidas/fotos: configuramos el mueble a tu espacio." },
            { n: "03", text: "Sin nada: un asesor guía desde cero." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 text-[13px]">
              <span className="w-6 h-6 shrink-0 rounded-full bg-[#F0EFEB] flex items-center justify-center font-mono text-[10px] text-[#151515]/40">
                {item.n}
              </span>
              <span className="text-[#151515]/70 leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Direct contact */}
      <div className="bg-[#FAFAF8] border border-black/6 rounded-sm p-6">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B38B67] mb-1.5">
          ¿Preferís hablar directo?
        </p>
        <h4 className="font-display text-[20px] font-light mb-2">Contacto directo</h4>
        <p className="text-[13px] text-[#151515]/50 mb-4">
          Un asesor responde por WhatsApp con precio real.
        </p>
        <a
          href="https://wa.me/5491151359303?text=Hola%20Suplacard%2C%20quiero%20consultar%20sobre%20un%20mueble%20a%20medida."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-[#151515] text-white text-[13px] font-medium hover:bg-[#B38B67] transition-colors mb-2"
        >
          <MessageCircle size={15} /> WhatsApp
        </a>
        <a
          href="tel:+541151359303"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-black/10 text-[#151515] text-[13px] font-medium hover:border-[#151515] transition-colors"
        >
          <Phone size={15} /> 11 5135-9303
        </a>
      </div>
    </aside>
  );
}