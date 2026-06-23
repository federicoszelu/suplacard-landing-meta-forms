import React from "react";
import { ChevronDown } from "lucide-react";

const UNIDADES = ["cm", "m", "mm"];

export default function MeasureInput({ label, placeholder, value, unit, onChange, onUnitChange, error }) {
  return (
    <div>
      {label && (
        <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#151515]/40 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex">
        <input
          type="number"
          className={`w-full border border-black/10 bg-[#FAFAF8] px-3.5 py-2.5 text-[14px] rounded-sm outline-none transition-all focus:border-[#151515] focus:bg-white ${
            error ? "border-[#9b4d3d]" : ""
          }`}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="relative -ml-px">
          <select
            value={unit || "cm"}
            onChange={(e) => onUnitChange(e.target.value)}
            className="appearance-none h-full pl-3 pr-7 border border-l-0 border-black/10 bg-[#F0EFEB] text-[13px] font-medium text-[#151515] outline-none cursor-pointer hover:bg-[#E8E5DE] transition-colors rounded-r-sm"
          >
            {UNIDADES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#151515]/40" />
        </div>
      </div>
      {error && <p className="text-[11px] text-[#9b4d3d] mt-1">{error}</p>}
    </div>
  );
}