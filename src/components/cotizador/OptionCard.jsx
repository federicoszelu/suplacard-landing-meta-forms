import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function OptionCard({
  label,
  description,
  eyebrow,
  image,
  selected,
  onClick,
  className = "",
  intervalo = 3500,
}) {
  // "image" puede ser una foto sola o una tanda. Si es tanda, van
  // pasando con fundido. Cada tarjeta recibe un intervalo distinto
  // desde StepProducto, asi las tres no cambian todas juntas, que
  // queda inquieto.
  // Cada foto puede ser un texto (src) o { src, srcSet }.
  const fotos = (Array.isArray(image) ? image : image ? [image] : []).map((f) => (typeof f === "string" ? { src: f } : f));
  const [i, setI] = useState(0);
  // Solo se montan la foto que se ve y la siguiente: antes bajaban las 7-8 de cada
  // tarjeta de entrada (unas 25 fotos) y competian con lo que importa.
  const [vistas, setVistas] = useState(() => new Set([0]));
  useEffect(() => {
    setVistas((v) => (v.has(i) && v.has((i + 1) % fotos.length) ? v : new Set([...v, i, (i + 1) % fotos.length])));
  }, [i, fotos.length]);

  useEffect(() => {
    if (fotos.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % fotos.length), intervalo);
    return () => clearInterval(t);
  }, [fotos.length, intervalo]);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative text-left border transition-all duration-200 overflow-hidden flex flex-col ${
        selected
          ? "border-[#111111] bg-white"
          : "border-[#E4E0DB] bg-white hover:border-[#111111]"
      } ${className}`}
      style={{ minHeight: fotos.length ? 200 : undefined, borderRadius: 1 }}
    >
      {fotos.length > 0 && (
        <div className="relative h-32 sm:h-40 overflow-hidden bg-[#EAE6E1]">
          {fotos.map((f, idx) => vistas.has(idx) && (
            <img
              key={f.src}
              src={f.src}
              srcSet={f.srcSet}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              alt={`${label} a medida fabricado por Suplacard`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              style={{ opacity: idx === i ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-1 flex-1">
        {eyebrow && (
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#767676",
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        )}
        <span
          className="text-[#111111] mt-1"
          style={{ fontSize: "1.25rem", fontWeight: 200, lineHeight: 1.2, letterSpacing: "-0.02em" }}
        >
          {label}
        </span>
        {description && (
          <span className="mt-2" style={{ fontSize: "0.82rem", color: "#666666", lineHeight: 1.6 }}>
            {description}
          </span>
        )}
      </div>

      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-[#111111] text-white flex items-center justify-center">
          <Check size={13} strokeWidth={2.5} />
        </div>
      )}
    </motion.button>
  );
}
