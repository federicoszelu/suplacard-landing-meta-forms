import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function OptionCard({ label, description, eyebrow, image, selected, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative text-left border-[1.5px] transition-all duration-200 rounded-sm overflow-hidden flex flex-col ${
        selected
          ? "border-[#151515] bg-white shadow-sm"
          : "border-black/8 bg-[#FAFAF8] hover:border-[#B38B67]/50 hover:bg-white"
      } ${className}`}
      style={{ minHeight: image ? 200 : undefined }}
    >
      {image && (
        <div className="relative h-32 sm:h-40 overflow-hidden">
          <img
            src={image}
            alt={label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-4 flex flex-col gap-1 flex-1">
        {eyebrow && (
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B38B67]">
            {eyebrow}
          </span>
        )}
        <span className="font-display text-[18px] font-normal leading-tight text-[#151515]">
          {label}
        </span>
        {description && (
          <span className="text-[12px] text-[#151515]/45 mt-1 leading-relaxed">
            {description}
          </span>
        )}
      </div>

      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#B38B67] text-white flex items-center justify-center">
          <Check size={13} strokeWidth={2.5} />
        </div>
      )}
    </motion.button>
  );
}