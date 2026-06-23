import React from "react";
import StepKicker from "../StepKicker";
import FieldInput from "../FieldInput";
import FileUpload from "../FileUpload";
import CheckOption from "../CheckOption";

const PLAN_CHECKS = ["Plano con medidas", "Plano con materiales", "Plano con aperturas", "Detalles técnicos"];

export default function StepTecnica({ state, setState, files, setFiles }) {
  const path = getPath(state.entrada);
  const isCocina = state.producto === "Cocina";

  const titles = {
    planos: "Subí el plano del proyecto.",
    medidas: isCocina ? "Cargá las medidas de la cocina." : `Cargá las medidas del ${state.producto?.toLowerCase() || "mueble"}.`,
    referencia: "Subí tu referencia visual.",
    nada: "Arranquemos con lo mínimo.",
  };
  const hints = {
    planos: "Si el plano está completo, evitamos preguntas duplicadas.",
    medidas: isCocina ? "Metros lineales, alto y profundidad ayudan a estimar módulos." : "Alto, ancho y fondo son la base para calcular puertas e interior.",
    referencia: "La imagen orienta el diseño; pedimos una medida aproximada.",
    nada: "No bloqueamos al cliente. Pedimos lo mínimo para que el asesor pueda orientar.",
  };

  const update = (field, value) => setState((s) => ({ ...s, extra: { ...s.extra, [field]: value } }));
  const togglePlanCheck = (label) => {
    setState((s) => {
      const checks = s.planChecks || [];
      return { ...s, planChecks: checks.includes(label) ? checks.filter((c) => c !== label) : [...checks, label] };
    });
  };
  const addFiles = (key, newFiles) => {
    setFiles((f) => ({ ...f, [key]: [...(f[key] || []), ...newFiles] }));
  };
  const removeFile = (key, index) => {
    setFiles((f) => ({ ...f, [key]: (f[key] || []).filter((_, i) => i !== index) }));
  };

  return (
    <div>
      <StepKicker kicker="Información técnica" title={titles[path]} hint={hints[path]} />

      {path === "planos" && (
        <>
          <div className="border-l-[3px] border-[#B38B67] bg-[#B38B67]/5 px-4 py-3 text-[13px] text-[#151515]/60 mb-5 rounded-r-sm">
            Si el plano viene de arquitecto, solo confirmamos que tenga lo necesario para cotizar.
          </div>
          <FileUpload
            label="Subir plano, PDF o croquis técnico"
            hint="PDF, JPG, PNG o captura del plano."
            accept="image/*,.pdf"
            files={files.plano || []}
            onChange={(f) => addFiles("plano", f)}
            onRemove={(i) => removeFile("plano", i)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {PLAN_CHECKS.map((c) => (
              <CheckOption
                key={c}
                label={c.replace("Plano con ", "El plano incluye ").replace("Detalles técnicos", "Tiene detalles técnicos")}
                checked={(state.planChecks || []).includes(c)}
                onChange={() => togglePlanCheck(c)}
              />
            ))}
          </div>
        </>
      )}

      {path === "medidas" && (
        <>
          {isCocina ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <FieldInput label="Metros lineales" type="number" placeholder="Ej: 4.20" value={state.extra?.metrosCocina} onChange={(v) => update("metrosCocina", v)} />
              <FieldInput label="Alto disponible (cm)" type="number" placeholder="Ej: 260" value={state.extra?.altoCocina} onChange={(v) => update("altoCocina", v)} />
              <FieldInput label="Profundidad (cm)" type="number" placeholder="Ej: 60" value={state.extra?.fondoCocina} onChange={(v) => update("fondoCocina", v)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <FieldInput label="Alto (cm)" type="number" placeholder="Ej: 260" value={state.extra?.alto} onChange={(v) => update("alto", v)} />
              <FieldInput label="Ancho (cm)" type="number" placeholder="Ej: 300" value={state.extra?.ancho} onChange={(v) => update("ancho", v)} />
              <FieldInput label="Fondo (cm)" type="number" placeholder="Ej: 60" value={state.extra?.fondo} onChange={(v) => update("fondo", v)} />
            </div>
          )}
          <FileUpload
            label="Foto del espacio o pared"
            hint="Ayuda a validar columnas, nichos, enchufes, zócalos y accesos."
            accept="image/*"
            files={files.espacio || []}
            onChange={(f) => addFiles("espacio", f)}
            onRemove={(i) => removeFile("espacio", i)}
          />
        </>
      )}

      {path === "referencia" && (
        <>
          <FileUpload
            label="Subir foto o referencia"
            hint="Pinterest, Instagram, proyecto anterior o foto del espacio."
            accept="image/*,.pdf"
            files={files.referencia || []}
            onChange={(f) => addFiles("referencia", f)}
            onRemove={(i) => removeFile("referencia", i)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput label="Medida aproximada principal" placeholder="Ej: pared de 3 m" value={state.extra?.medidaAprox} onChange={(v) => update("medidaAprox", v)} />
            <FieldInput label="Qué habría que adaptar" placeholder="Ej: quiero algo parecido, más chico" value={state.extra?.adaptacion} onChange={(v) => update("adaptacion", v)} />
          </div>
        </>
      )}

      {path === "nada" && (
        <>
          <div className="border-l-[3px] border-[#B38B67] bg-[#B38B67]/5 px-4 py-3 text-[13px] text-[#151515]/60 mb-5 rounded-r-sm">
            No bloqueamos al cliente. Pedimos lo mínimo para que el asesor pueda orientar.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <FieldInput label="Medida aproximada" placeholder="Ej: pared de 3 m" value={state.extra?.medidaMinima} onChange={(v) => update("medidaMinima", v)} />
            <FieldInput label="Ambiente" placeholder="Ej: dormitorio principal" value={state.extra?.ambiente} onChange={(v) => update("ambiente", v)} />
          </div>
          <FieldInput label="¿Qué querés resolver?" type="textarea" placeholder="Ej: necesito más guardado, quiero renovar la cocina, tengo poco espacio..." value={state.extra?.ideaInicial} onChange={(v) => update("ideaInicial", v)} />
        </>
      )}
    </div>
  );
}

function getPath(entrada) {
  if (entrada === "Tengo planos") return "planos";
  if (entrada === "Tengo medidas") return "medidas";
  if (entrada === "Tengo referencia") return "referencia";
  if (entrada === "No tengo nada") return "nada";
  return "medidas";
}