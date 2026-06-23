import React from "react";

export default function StepKicker({ kicker, title, hint }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#B38B67] mb-2">
        {kicker}
      </p>
      <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-[0.96] tracking-[-0.025em] text-[#151515] mb-2">
        {title}
      </h3>
      {hint && (
        <p className="text-[14px] text-[#151515]/50 max-w-[55ch] leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}