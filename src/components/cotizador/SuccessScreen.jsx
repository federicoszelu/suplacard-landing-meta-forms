import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function SuccessScreen({ producto, onReset }) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: producto || "",
        content_category: "cotizador",
      });
    }
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        producto: producto || "",
      });
    }
    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "lead_cotizador",
        producto: producto || "",
      });
    }
  }, [producto]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 px-6"
    >
      <div className="text-6xl mb-6">✅</div>
      <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light tracking-[-0.025em] text-[#151515] mb-4">
        ¡Tu consulta fue enviada con éxito!
      </h3>
      <p className="text-[15px] text-[#151515]/50 max-w-[44ch] mx-auto mb-8 leading-relaxed">
        Un asesor de Suplacard con más de 30 años de experiencia va a revisar tu proyecto y te responde a la brevedad con un presupuesto real.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-[#151515] text-white text-[13px] font-medium hover:bg-[#B38B67] transition-colors"
      >
        Nueva consulta
      </button>
    </motion.div>
  );
}