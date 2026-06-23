import React, { useState } from "react";
import StepKicker from "../StepKicker";
import OptionCard from "../OptionCard";
import FieldInput from "../FieldInput";
import MeasureInput from "../MeasureInput";
import FileUpload from "../FileUpload";
import { Plus } from "lucide-react";

const ENTRADAS = [
  {
    id: "Tengo planos",
    label: "Tengo planos",
    eyebrow: "Más preciso",
    description: "Adjuntá planos en PDF o JPG. Un asesor los valida y te cotiza.",
  },
  {
    id: "Tengo medidas/fotos",
    label: "Tengo medidas o fotos",
    eyebrow: "Bastante preciso",
    description: "Ingresá las medidas y adjuntá fotos del espacio.",
  },
  {
    id: "No tengo nada",
    label: "No tengo nada",
    eyebrow: "Orientación inicial",
    description: "Contanos qué buscás y te guiamos desde cero.",
  },
];

export default function StepEntrada({ state, setState, files, setFiles, errors }) {
  const productos = state.productos || [];
  const configs = state.configs || {};

  const completedCount = productos.filter((p) => configs[p]?.entrada).length;
  const [visibleCount, setVisibleCount] = useState(Math.max(1, completedCount));

  const updateConfig = (product, field, value) => {
    setState((s) => ({
      ...s,
      configs: {
        ...s.configs,
        [product]: {
          ...(s.configs?.[product] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleFilesChange = (product, newFiles) => {
    setFiles((f) => ({ ...f, [product]: [...(f[product] || []), ...newFiles] }));
  };

  const handleFileRemove = (product, index) => {
    setFiles((f) => ({ ...f, [product]: (f[product] || []).filter((_, i) => i !== index) }));
  };

  return (
    <div>
      <StepKicker
        kicker="Paso 2 · Detalles del proyecto"
        title={<>¿Qué tenés para <em className="italic text-[#B38B67]">arrancar?</em></>}
        hint="El punto de partida define qué tan preciso es el precio que te damos."
      />

      <div className="space-y-8">
        {productos.slice(0, visibleCount).map((product, idx) => {
          const config = configs[product] || {};
          const productFiles = files[product] || [];
          const productErrors = errors?.[product] || {};

          return (
            <div key={product}>
              {idx > 0 && <div className="border-t border-black/8 -mx-2 mb-8" />}

              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display text-[22px] font-light text-[#151515]">{product}</h3>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B38B67] border border-[#B38B67]/30 rounded-full px-2.5 py-1">
                  Producto {idx + 1} de {productos.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {ENTRADAS.map((e) => (
                  <OptionCard
                    key={e.id}
                    label={e.label}
                    eyebrow={e.eyebrow}
                    description={e.description}
                    selected={config.entrada === e.id}
                    onClick={() => updateConfig(product, "entrada", e.id)}
                  />
                ))}
              </div>

              {config.entrada === "Tengo planos" && (
                <FileUpload
                  label="Adjuntar planos"
                  hint="PDF o JPG. Podés adjuntar varios archivos."
                  accept=".pdf,.jpg,.jpeg,.png"
                  files={productFiles}
                  onChange={(f) => handleFilesChange(product, f)}
                  onRemove={(i) => handleFileRemove(product, i)}
                />
              )}

              {config.entrada === "Tengo medidas/fotos" && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <MeasureInput
                      label="Ancho *"
                      placeholder="200"
                      value={config.ancho}
                      unit={config.anchoUnidad}
                      onChange={(v) => updateConfig(product, "ancho", v)}
                      onUnitChange={(v) => updateConfig(product, "anchoUnidad", v)}
                      error={productErrors.medidas && !config.ancho ? "Requerido" : ""}
                    />
                    <MeasureInput
                      label="Alto *"
                      placeholder="240"
                      value={config.alto}
                      unit={config.altoUnidad}
                      onChange={(v) => updateConfig(product, "alto", v)}
                      onUnitChange={(v) => updateConfig(product, "altoUnidad", v)}
                      error={productErrors.medidas && !config.alto ? "Requerido" : ""}
                    />
                    <MeasureInput
                      label="Profundidad *"
                      placeholder="60"
                      value={config.profundidad}
                      unit={config.profundidadUnidad}
                      onChange={(v) => updateConfig(product, "profundidad", v)}
                      onUnitChange={(v) => updateConfig(product, "profundidadUnidad", v)}
                      error={productErrors.medidas && !config.profundidad ? "Requerido" : ""}
                    />
                  </div>

                  <FileUpload
                    label="Adjuntar fotos o planos"
                    hint="JPG, PNG o PDF. Fotos del espacio actual o planos si los tenés."
                    accept=".jpg,.jpeg,.png,.pdf"
                    files={productFiles}
                    onChange={(f) => handleFilesChange(product, f)}
                    onRemove={(i) => handleFileRemove(product, i)}
                  />

                  <FieldInput
                    label="Materiales, herrajes y distribución interna"
                    type="textarea"
                    placeholder="Describí qué materiales te interesan, qué herrajes buscás, cómo querés distribuir el interior..."
                    value={config.descripcion}
                    onChange={(v) => updateConfig(product, "descripcion", v)}
                  />
                </div>
              )}

              {config.entrada === "No tengo nada" && (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <FieldInput
                      label="Medida aproximada *"
                      placeholder="Ej: 2 metros de ancho"
                      value={config.medidaAprox}
                      onChange={(v) => updateConfig(product, "medidaAprox", v)}
                      error={productErrors.nada && !config.medidaAprox ? "Requerido" : ""}
                    />
                    <FieldInput
                      label="Ambiente *"
                      placeholder="Ej: Dormitorio, cocina..."
                      value={config.ambiente}
                      onChange={(v) => updateConfig(product, "ambiente", v)}
                      error={productErrors.nada && !config.ambiente ? "Requerido" : ""}
                    />
                  </div>

                  <FieldInput
                    label="¿Qué buscás o qué te interesa?"
                    type="textarea"
                    placeholder="Contanos qué necesitás, qué idea tenés en mente..."
                    value={config.descripcionNada}
                    onChange={(v) => updateConfig(product, "descripcionNada", v)}
                  />
                </div>
              )}

              {productErrors.entrada && (
                <p className="text-[12px] text-[#9b4d3d] mt-3">{productErrors.entrada}</p>
              )}
            </div>
          );
        })}
      </div>

      {visibleCount < productos.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + 1)}
          className="mt-6 w-full flex items-center justify-center gap-2 h-12 border border-dashed border-black/15 rounded-sm text-[13px] font-medium text-[#151515]/60 hover:border-[#B38B67] hover:text-[#B38B67] transition-colors"
        >
          <Plus size={16} /> Agregar {productos[visibleCount]}
        </button>
      )}
    </div>
  );
}