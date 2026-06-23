import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "¿Dónde están los showrooms de Suplacard?",
    a: "Suplacard tiene 5 showrooms en Buenos Aires: Palermo (Guatemala 5687), Belgrano (Av. Forest 1184), Floresta (Av. Mariano Acosta 951), Martínez (Av. Edison 2805) y Lomas de Zamora (Av. H. Yrigoyen 9702).",
  },
  {
    q: "¿Puedo pedir presupuesto sin tener plano ni medidas?",
    a: "Sí. El cotizador tiene un camino para quienes no tienen nada todavía. Un asesor te guía desde cero.",
  },
  {
    q: "¿Suplacard fabrica o revende muebles?",
    a: "Suplacard tiene fábrica propia en Villa Madero, Buenos Aires. Diseña y produce internamente placards, vestidores y cocinas a medida.",
  },
  {
    q: "¿Qué muebles a medida fabrica Suplacard?",
    a: "Placards, vestidores, cocinas, frentes, interiores y vanitorios a medida en Buenos Aires.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-[#F9F8F6] border-t border-black/5">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B38B67] mb-4">
              Preguntas frecuentes
            </p>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-[#151515]">
              Todo lo que{" "}
              <em className="italic text-[#B38B67]">necesitás saber.</em>
            </h2>
          </div>

          <div className="divide-y divide-black/8">
            {FAQS.map((item, idx) => {
              const isOpen = open === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    className="flex items-center justify-between gap-4 w-full text-left group"
                  >
                    <span className="font-body text-[16px] sm:text-[17px] font-medium text-[#151515] group-hover:text-[#B38B67] transition-colors">
                      {item.q}
                    </span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#151515]">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <p className="overflow-hidden text-[14px] sm:text-[15px] text-[#151515]/60 leading-relaxed">
                      <span className="block pt-4 pr-12">{item.a}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}