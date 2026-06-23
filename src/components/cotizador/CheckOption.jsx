import React from "react";

export default function CheckOption({ label, checked, onChange }) {
  return (
    <label
      className={`flex items-center gap-3 border rounded-sm px-4 py-3 cursor-pointer text-[13px] transition-all duration-150 ${
        checked
          ? "border-[#151515] bg-white/80"
          : "border-black/6 hover:border-[#B38B67]/40 hover:bg-white/50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[#151515] shrink-0"
      />
      <span className="text-[#151515]/80">{label}</span>
    </label>
  );
}