import React from "react";
import { Check } from "lucide-react";
import StepKicker from "../StepKicker";
import OptionCard from "../OptionCard";
import CheckOption from "../CheckOption";

const PRODUCTOS = [
  { id: "Placard", eyebrow: "Dormitorio", description: "Placard a medida con distribución personalizada." },
  { id: "Vestidor", eyebrow: "Walk-in", description: "Vestidor abierto o cerrado, a tu medida." },
  { id: "Cocina", eyebrow: "Cocina", description: "Cocina a medida con isla, bajo mesada y alacena." },
];

const ALL_PRODUCTOS = ["Placard", "Vestidor", "Cocina", "Vanitorio"];

export default function StepProducto({ state, setState, images, errors }) {
  const productos = state.productos || [];
  const multiMode = state.multiMode || false;

  const toggleMulti = () => {
    setState((s) => ({ ...s, multiMode: !s.multiMode, productos: [] }));
  };

  const selectSingle = (prod) => {
    setState((s) => ({ ...s, productos: [prod], multiMode: false }));
  };

  const toggleProduct = (prod) => {
    setState((s) => {
      const current = s.productos || [];
      const has = current.includes(prod);
      return {
        ...s,
        productos: has ? current.filter((p) => p !== prod) : [...current, prod],
      };
    });
  };

  return (
    <div>
      <StepKicker
        kicker="Paso 1 · Producto"
        title={<>¿Qué querés <em className="italic text-[#B38B67]">presupuestar?</em></>}
        hint="Elegí un producto o marcá 'Más de un producto' para cotizar varias cosas en una sola consulta."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {PRODUCTOS.map((p) => (
          <OptionCard
            key={p.id}
            label={p.id}
            eyebrow={p.eyebrow}
            description={p.description}
            image={images?.[p.id]}
            selected={!multiMode && productos.includes(p.id)}
            onClick={() => selectSingle(p.id)}
          />
        ))}
      </div>

      {/* Más de un producto */}
      <button
        type="button"
        onClick={toggleMulti}
        className={`w-full text-left border-[1.5px] rounded-sm p-4 transition-all duration-200 ${
          multiMode
            ? "border-[#151515] bg-white shadow-sm"
            : "border-black/8 bg-[#FAFAF8] hover:border-[#B38B67]/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 shrink-0">
            {multiMode ? (
              <div className="w-6 h-6 rounded-full bg-[#B38B67] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded border-[1.5px] border-black/20" />
            )}
          </div>
          <div>
            <span className="font-display text-[16px] text-[#151515]">Más de un producto</span>
            <p className="text-[12px] text-[#151515]/45 mt-0.5">Cotizá varios muebles en una sola consulta. El formulario se repite para cada uno.</p>
          </div>
        </div>
      </button>

      {multiMode && (
        <div className="mt-4 p-4 bg-[#FAFAF8] border border-black/8 rounded-sm">
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B38B67] mb-3">
            Seleccioná los productos
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PRODUCTOS.map((prod) => (
              <CheckOption
                key={prod}
                label={prod}
                checked={productos.includes(prod)}
                onChange={() => toggleProduct(prod)}
              />
            ))}
          </div>
        </div>
      )}

      {errors?.productos && (
        <p className="text-[12px] text-[#9b4d3d] mt-3">{errors.productos}</p>
      )}
    </div>
  );
}