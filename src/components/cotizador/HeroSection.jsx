import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

/* Hero con la misma arquitectura que suplacard.com:
   foto a sangre completa, degradado oscuro encima y el texto sobre
   la imagen. Nada de columna partida.

   Las tres fotos son las de las paginas de producto del sitio, asi
   no se duplican archivos y siempre coinciden con la web. */
const SLIDES = [
  { src: "https://www.suplacard.com/img/hero-placards.jpg",   alt: "Placard a medida fabricado por Suplacard" },
  { src: "https://www.suplacard.com/img/hero-cocinas.jpg",    alt: "Cocina a medida fabricada por Suplacard" },
  { src: "https://www.suplacard.com/img/hero-vestidores.jpg", alt: "Vestidor a medida fabricado por Suplacard" },
];

const DURACION = 5000;

const DATOS = [
  { n: "30+",      l: "Años de trayectoria" },
  { n: "5",        l: "Showrooms en CABA y GBA" },
  { n: "10.000+",  l: "Proyectos entregados" },
  { n: "Propia",   l: "Fábrica en Buenos Aires" },
];

export default function HeroSection({ heroImage, onStart }) {
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), DURACION);
    return () => clearInterval(t);
  }, [pausado]);

  return (
    <>
      <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-[#111111]">
        {/* Fotos de fondo, con fundido entre una y otra */}
        {SLIDES.map((s, idx) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading={idx === 0 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: idx === i ? 1 : 0 }}
          />
        ))}

        {/* Mismo degradado que .page-hero-bg::after del sitio */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(12,12,12,0.78), rgba(12,12,12,0.28) 60%, rgba(12,12,12,0.12))",
          }}
        />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
              Cotizador guiado
            </p>

            <h1 className="h-display text-white mb-7" style={{ maxWidth: "15ch" }}>
              Cotizá tu mueble <b>a medida.</b>
            </h1>

            <p
              className="mb-9"
              style={{
                fontSize: "1.02rem",
                fontWeight: 300,
                maxWidth: "44ch",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Placard, vestidor o cocina. El formulario se adapta a lo que tenés:
              plano, medidas, foto o nada. Un asesor real te responde con un
              precio concreto.
            </p>

            <button onClick={onStart} className="btn-sup inline-flex items-center gap-3 group">
              Empezar cotización
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>

            {/* Puntos: dejan ver cuantas fotos hay y frenan el pase al tocarlos */}
            <div className="flex gap-2 mt-12">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.src}
                  aria-label={`Ver foto ${idx + 1} de ${SLIDES.length}`}
                  onClick={() => { setI(idx); setPausado(true); }}
                  className="h-[2px] transition-all duration-500"
                  style={{
                    width: idx === i ? 34 : 16,
                    background: idx === i ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Franja de cifras, separada del hero como en el sitio */}
      <section className="border-b" style={{ borderColor: "#E4E0DB", background: "#FFFFFF" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-14 lg:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {DATOS.map((d) => (
              <div key={d.l}>
                <div
                  style={{
                    fontSize: "clamp(2.1rem, 4vw, 3.2rem)",
                    fontWeight: 200,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: "#111111",
                  }}
                >
                  {d.n}
                </div>
                <div
                  style={{
                    fontSize: "0.64rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#A8A8A8",
                    marginTop: "1rem",
                  }}
                >
                  {d.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
