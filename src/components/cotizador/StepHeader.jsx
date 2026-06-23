import React from "react";

export default function StepHeader({ currentStep, totalSteps }) {
  const displayStep = Math.min(currentStep, totalSteps);
  const progress = (displayStep / totalSteps) * 100;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-7 pb-5">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#B38B67] mb-2">
            Cotizador guiado
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#151515]">
            Armemos tu{" "}
            <em className="italic text-[#B38B67]">presupuesto.</em>
          </h2>
          <p className="text-[14px] text-[#151515]/50 mt-3 max-w-[45ch]">
            Más de 30 años fabricando muebles a medida en Buenos Aires. Contanos tu proyecto y un asesor real te brindará un presupuesto concreto.
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 border border-black/10 rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[#151515]/50 whitespace-nowrap">
          Paso {displayStep} / {totalSteps}
        </span>
      </div>
      <div className="h-[3px] bg-[#F0EFEB]">
        <div
          className="h-full bg-[#151515] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}