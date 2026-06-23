import React from "react";
import StepKicker from "../StepKicker";

const formatWhatsApp = (num) => {
  if (!num) return "";
  const digits = num.replace(/\D/g, "");
  if (digits.length >= 8) {
    const area = digits.slice(0, -8);
    const main = digits.slice(-8);
    return `${area} ${main.slice(0, 4)}-${main.slice(4)}`.trim();
  }
  return num;
};

const Row = ({ label, children }) => (
  <div className="flex gap-2 min-w-0">
    <span className="text-[#151515]/40 w-28 shrink-0">{label}</span>
    <span className="text-[#151515] break-all min-w-0">{children}</span>
  </div>
);

export default function StepResumen({ state, files }) {
  const productos = state.productos || [];
  const configs = state.configs || {};
  const totalFiles = Object.values(files).flat().length;

  return (
    <div>
      <StepKicker
        kicker="Paso 4 · Resumen"
        title={<>Revisá y <em className="italic text-[#B38B67]">enviá.</em></>}
        hint="Verificá que todo esté bien. Al enviar, guardamos tu consulta y abrimos WhatsApp con el mensaje listo para mandar."
      />

      <div className="space-y-4">
        {productos.map((p, idx) => {
          const cfg = configs[p] || {};
          return (
            <div key={p} className="bg-[#FAFAF8] border border-black/8 rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-display text-[18px] text-[#151515]">{p}</h4>
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#B38B67] border border-[#B38B67]/30 rounded-full px-2 py-0.5">
                  {idx + 1} de {productos.length}
                </span>
              </div>
              <div className="space-y-2 text-[13px]">
                {cfg.entrada && (
                  <Row label="Punto de partida">{cfg.entrada}</Row>
                )}
                {cfg.entrada === "Tengo medidas/fotos" && (cfg.alto || cfg.ancho || cfg.profundidad) && (
                  <Row label="Medidas">
                    Alto {cfg.alto || "-"}{cfg.altoUnidad || "cm"} · Ancho {cfg.ancho || "-"}{cfg.anchoUnidad || "cm"} · Prof. {cfg.profundidad || "-"}{cfg.profundidadUnidad || "cm"}
                  </Row>
                )}
                {cfg.entrada === "No tengo nada" && cfg.medidaAprox && (
                  <Row label="Medida aprox.">{cfg.medidaAprox}</Row>
                )}
                {cfg.entrada === "No tengo nada" && cfg.ambiente && (
                  <Row label="Ambiente">{cfg.ambiente}</Row>
                )}
                {(cfg.descripcion || cfg.descripcionNada) && (
                  <Row label="Detalle">{cfg.descripcion || cfg.descripcionNada}</Row>
                )}
                {files[p] && files[p].length > 0 && (
                  <Row label="Archivos">{files[p].length} archivo(s)</Row>
                )}
              </div>
            </div>
          );
        })}

        <div className="bg-[#FAFAF8] border border-black/8 rounded-sm p-5">
          <h4 className="font-display text-[18px] text-[#151515] mb-3">Datos de contacto</h4>
          <div className="space-y-2 text-[13px]">
            {state.nombre && (
              <Row label="Nombre">{state.nombre}</Row>
            )}
            {state.whatsapp && (
              <Row label="WhatsApp">{formatWhatsApp(state.whatsapp)}</Row>
            )}
            {state.email && (
              <Row label="Email">{state.email}</Row>
            )}
            {state.localidad && (
              <Row label="Zona">{state.localidad}</Row>
            )}
            {state.obra && (
              <Row label="Obra">{state.obra}</Row>
            )}
            {state.urgencia && (
              <Row label="Urgencia">{state.urgencia}</Row>
            )}
            {state.comentarios && (
              <Row label="Comentarios">{state.comentarios}</Row>
            )}
          </div>
        </div>

        {totalFiles > 0 && (
          <p className="text-[12px] text-[#151515]/40 text-center break-all">
            📎 {totalFiles} archivo/s — se suben automáticamente al enviar
          </p>
        )}
      </div>
    </div>
  );
}