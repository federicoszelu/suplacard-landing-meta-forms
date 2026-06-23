import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export default function ConsultaGate({ onSubmit }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    onSubmit(value.trim());
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-5 py-20">
      <div className="max-w-[400px] w-full text-center">
        <div className="w-14 h-14 rounded-full bg-[#151515] flex items-center justify-center mx-auto mb-6">
          <Lock size={22} className="text-white" />
        </div>
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-light tracking-[-0.025em] text-[#151515] mb-3">
          Acceso <em className="italic text-[#B38B67]">restringido.</em>
        </h1>
        <p className="text-[14px] text-[#151515]/50 leading-relaxed mb-8 max-w-[36ch] mx-auto">
          Esta consulta está protegida. Ingresá el código de acceso que aparece en el mensaje de WhatsApp para ver el detalle y descargar los archivos.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Código de acceso"
            autoFocus
            className="w-full h-12 px-5 rounded-full border border-black/10 bg-white text-[14px] text-[#151515] text-center font-mono tracking-[0.1em] placeholder:text-[#151515]/25 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-[#B38B67] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="w-full h-12 rounded-full bg-[#151515] text-white text-[14px] font-medium hover:bg-[#B38B67] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Acceder"}
          </button>
        </form>
        <a href="/" className="inline-block mt-6 text-[12px] text-[#151515]/40 hover:text-[#151515] transition-colors">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}