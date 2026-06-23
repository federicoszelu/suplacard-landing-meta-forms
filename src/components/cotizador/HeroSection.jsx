import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const SLIDES = [
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/649394cf3_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/835324a0b_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/4405c8783_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/ea75aced0_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/eb7b092f1_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/c0245c757_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/4cf084668_generated_image.png",
  "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/82e796756_generated_image.png",
];

const SLIDE_DURATION = 3000;

export default function HeroSection({ heroImage, onStart }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:grid lg:grid-cols-2">
      {/* Image slideshow side */}
      <div className="relative h-[50vh] lg:h-auto overflow-hidden bg-[#E8E5DE]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <img
              src={slide}
              alt={slide.replace("hero-", "").replace(".jpg", "")}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F6] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#F9F8F6]" />
      </div>

      {/* Content side */}
      <div className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-12 lg:py-20 bg-[#F9F8F6]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B38B67] mb-5">
            Cotizador guiado · Suplacard
          </p>

          <h1 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] tracking-[-0.04em] text-[#151515] mb-6">
            Cotizá tu{" "}
            <br className="hidden sm:block" />
            mueble a{" "}
            <em className="italic text-[#B38B67]">medida.</em>
          </h1>

          <p className="text-lg text-[#151515]/70 max-w-[48ch] leading-relaxed mb-8">
            Placard, vestidor o cocina. El formulario se adapta a lo que tenés:
            plano, medidas, foto o nada. Un asesor real te responde con un precio
            concreto.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-10">
            {["Sin compromiso", "Respuesta en el día", "Fábrica propia", "+30 años"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/8 bg-white/60 text-[12px] text-[#151515]/60"
              >
                <span className="text-[#B38B67] font-bold text-[10px]">✓</span>
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 h-14 px-8 rounded-full bg-[#151515] text-white text-[15px] font-medium tracking-wide hover:bg-[#B38B67] transition-all duration-300"
          >
            Empezar cotización
            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-8 border-t border-black/8">
            {[
              { num: "30+", label: "Años de trayectoria" },
              { num: "5", label: "Showrooms en CABA y GBA" },
              { num: "10.000+", label: "Proyectos entregados" },
              { num: "Fábrica propia", label: "Villa Madero, Buenos Aires" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-[28px] sm:text-[32px] font-light text-[#151515] leading-tight">
                  {s.num}
                </div>
                <div className="text-[12px] text-[#151515]/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}