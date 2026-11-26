import { useEffect, useState } from "react";

// BLACK FRIDAY: se muestra solo del jueves 26/11 00:00 al lunes 30/11 23:59 (hora Argentina)
// y se apaga solo el martes 1/12 a las 00:00, sin volver a publicar.
// Sin eventos de medición: el botón solo baja al formulario (contrato de medición).
const INICIO = Date.parse("2026-11-25T00:00:00-03:00");
const FIN = Date.parse("2026-12-01T00:00:00-03:00");

function restante(ahora) {
  const ms = Math.max(0, FIN - ahora);
  const min = Math.floor(ms / 60000);
  return { d: Math.floor(min / 1440), h: Math.floor((min % 1440) / 60), m: min % 60 };
}

export default function BlackFriday({ onCotizar }) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  if (ahora < INICIO || ahora >= FIN) return null;
  const r = restante(ahora);
  const caja = (n, label) => (
    <div className="flex flex-col items-center min-w-[64px] sm:min-w-[76px] bg-white text-[#111111] px-3 py-3">
      <span className="text-3xl sm:text-4xl font-light tabular-nums leading-none">{String(n).padStart(2, "0")}</span>
      <span className="mt-2 text-[0.6rem] tracking-[0.22em] uppercase text-[#111111]/60">{label}</span>
    </div>
  );

  return (
    <section aria-label="Black Friday" className="bg-[#111111] text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[0.66rem] tracking-[0.28em] uppercase text-white/70">Solo este fin de semana</p>
            <h2 className="mt-3 text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem] leading-none tracking-[-0.02em]" style={{ fontWeight: 600 }}>
              BLACK FRIDAY
            </h2>
            <p className="mt-6 text-[2.2rem] sm:text-[2.8rem] leading-tight" style={{ fontWeight: 300 }}>
              hasta <b className="font-semibold text-white">56% OFF</b>
            </p>
            <p className="mt-2 text-[0.95rem] text-white/80" style={{ fontWeight: 300 }}>
              En tienda física · todos nuestros showrooms
            </p>
            <button
              type="button"
              onClick={onCotizar}
              className="mt-7 inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#111111] hover:bg-[#EAE6E1] transition-colors"
              style={{ borderRadius: 1, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}
            >
              Cotizar ahora
            </button>
          </div>
          <div className="lg:text-right">
            <p className="text-[0.66rem] tracking-[0.28em] uppercase text-white/70 mb-4">Termina en</p>
            <div className="flex gap-2 sm:gap-3 lg:justify-end">
              {caja(r.d, "días")}
              {caja(r.h, "hs")}
              {caja(r.m, "min")}
            </div>
            <p className="mt-4 text-[0.78rem] text-white/70">Válido hasta el lunes 30/11 a las 23:59</p>
          </div>
        </div>
        <p className="mt-10 pt-5 border-t border-white/15 text-[0.7rem] leading-relaxed text-white/50">
          Promoción válida para presupuestos generados del 26/11 al 30/11/2026 en todos nuestros showrooms. Consultá las condiciones con tu asesor.
        </p>
      </div>
    </section>
  );
}
