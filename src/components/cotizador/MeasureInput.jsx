import React from "react";
import { ChevronDown } from "lucide-react";

const UNIDADES = ["cm", "m", "mm"];
const A_CM = { cm: 1, m: 100, mm: 0.1 };

// Un ambiente no pasa de 15 m. Si da más, casi seguro se coló un número de más o la unidad equivocada.
export function avisoMedida(value, unit) {
  const n = parseFloat(String(value || "").replace(",", "."));
  if (!n) return "";
  const cm = n * (A_CM[unit || "cm"] || 1);
  if (cm > 1500) return `Revisá: son ${(cm / 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })} metros`;
  return "";
}

export default function MeasureInput({ label, placeholder, value, unit, onChange, onUnitChange, error }) {
  const aviso = !error && avisoMedida(value, unit);
  return (
    <div>
      {label && (
        <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#151515]/[0.66] mb-1.5">
          {label}
        </label>
      )}
      <div className="flex">
        {/* text + inputMode en vez de type="number": en el navegador de Instagram/Facebook el number
            se comporta raro. 16px en el celular para que iOS no haga zoom al tocar. */}
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className={`w-full min-w-0 flex-1 border border-black/10 bg-[#FAFAF8] px-3.5 py-2.5 text-[16px] sm:text-[14px] rounded-sm outline-none transition-all focus:border-[#151515] focus:bg-white ${
            error || aviso ? "border-[#9b4d3d]" : ""
          }`}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ""))}
        />
        <div className="relative -ml-px shrink-0">
          <select
            value={unit || "cm"}
            onChange={(e) => onUnitChange(e.target.value)}
            className="appearance-none h-full pl-3 pr-7 border border-l-0 border-black/10 bg-[#F0EFEB] text-[16px] sm:text-[13px] font-medium text-[#151515] outline-none cursor-pointer hover:bg-[#E8E5DE] transition-colors rounded-r-sm"
          >
            {UNIDADES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#151515]/[0.66]" />
        </div>
      </div>
      {error && <p className="text-[11px] text-[#9b4d3d] mt-1">{error}</p>}
      {aviso && <p className="text-[11px] text-[#9b4d3d] mt-1">{aviso}</p>}
    </div>
  );
}
