import React from "react";
import StepKicker from "../StepKicker";
import FieldInput from "../FieldInput";

export default function StepContacto({ state, setState, errors }) {
  const update = (field, value) => setState((s) => ({ ...s, [field]: value }));

  return (
    <div>
      <StepKicker
        kicker="Datos finales"
        title="¿Dónde enviamos la cotización?"
        hint="Datos mínimos para que el asesor pueda continuar por WhatsApp."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <FieldInput
          label="Nombre y apellido *"
          placeholder="Ej: María García"
          value={state.nombre}
          onChange={(v) => update("nombre", v)}
          error={errors.nombre}
        />
        <FieldInput
          label="WhatsApp *"
          type="tel"
          placeholder="Ej: 11 5555-5555"
          value={state.whatsapp}
          onChange={(v) => update("whatsapp", v)}
          error={errors.whatsapp}
        />
        <FieldInput
          label="Email (opcional)"
          type="email"
          placeholder="tu@email.com"
          value={state.email}
          onChange={(v) => update("email", v)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <FieldInput
          label="Localidad / Barrio"
          placeholder="Ej: Palermo, Martínez..."
          value={state.localidad}
          onChange={(v) => update("localidad", v)}
        />
        <FieldInput label="Tipo de obra">
          <select
            className="w-full border border-black/10 bg-[#FAFAF8] px-3.5 py-2.5 text-[14px] rounded-sm outline-none transition-all focus:border-[#151515] focus:bg-white"
            value={state.obra || ""}
            onChange={(e) => update("obra", e.target.value)}
          >
            <option value="">Seleccioná...</option>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Obra nueva</option>
            <option>Refacción</option>
          </select>
        </FieldInput>
        <FieldInput label="Urgencia">
          <select
            className="w-full border border-black/10 bg-[#FAFAF8] px-3.5 py-2.5 text-[14px] rounded-sm outline-none transition-all focus:border-[#151515] focus:bg-white"
            value={state.urgencia || ""}
            onChange={(e) => update("urgencia", e.target.value)}
          >
            <option value="">Seleccioná...</option>
            <option>Lo antes posible</option>
            <option>Este mes</option>
            <option>1 a 3 meses</option>
            <option>Estoy comparando</option>
          </select>
        </FieldInput>
      </div>
      <FieldInput
        label="Comentarios adicionales"
        type="textarea"
        placeholder="¿Algo más que el asesor deba saber? ¿Más de un mueble? ¿Proyecto con arquitecto? Contanos."
        value={state.comentarios}
        onChange={(v) => update("comentarios", v)}
      />
    </div>
  );
}