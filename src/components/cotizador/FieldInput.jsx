import React from "react";

export default function FieldInput({ label, type = "text", placeholder, value, onChange, error, children }) {
  const base = "w-full border border-black/10 bg-[#FAFAF8] px-3.5 py-2.5 text-[14px] rounded-sm outline-none transition-all focus:border-[#151515] focus:bg-white";

  return (
    <div>
      {label && (
        <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#151515]/40 mb-1.5">
          {label}
        </label>
      )}
      {children || (
        type === "textarea" ? (
          <textarea
            className={`${base} min-h-[90px] resize-vertical ${error ? "border-[#9b4d3d]" : ""}`}
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : type === "select" ? null : (
          <input
            type={type}
            className={`${base} ${error ? "border-[#9b4d3d]" : ""}`}
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      )}
      {error && <p className="text-[11px] text-[#9b4d3d] mt-1">{error}</p>}
    </div>
  );
}