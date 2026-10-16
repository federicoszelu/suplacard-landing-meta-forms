import React from "react";
import { Check } from "lucide-react";
import CheckOption from "./CheckOption";

// Mismo catalogo que suplacard.com/contacto (MESADA_CATALOGO) y /mesadas/.
// Si se agrega un color alla, agregarlo aca tambien.
// Las muestras son fotos reales (webp de 200 px, ~6 KB) de suplacard.com y se piden recien cuando
// la persona elige Mesada: no pesan al abrir el cotizador.
const IMG = "https://www.suplacard.com/img/mesadas";

export const MESADA_CATALOGO = {
  "Granito": { s: "granito", c: ["Negro Brasil", "Negro Boreal", "Be Black", "Black Cosmic", "Gris Veteado", "Silver Grey", "Blanco Dallas", "Amarillo Oro", "Verde Labrador Ubatuba", "Azul Bahia", "Rosa Antico", "Gris Mara"] },
  "Mármol": { s: "marmol", c: ["Calacatta", "Calacatta Oyster", "Calacatta Leonardo", "Calacatta Verde", "Arabescato Orobico", "Paonazzo", "Negro Marquina", "Tundra Grey", "Fantastic Grey", "Desert Cream", "Rosso Venato", "Tiffany Green"] },
  "Cuarcita": { s: "cuarcita", c: ["Cuarcita Taj Mahal", "Mont Blanc", "Silver White", "Monalisa", "Adamantium", "Patagonia Pink", "Verde Xingu", "Verde Mist", "Blue Roma", "Black Salinas", "Negresco", "Allure"] },
  "Travertino": { s: "travertino", c: ["Travertino clásico a la veta", "Travertino clásico al agua", "Travertino clásico noce al agua", "Travertino Ivory a la veta", "Travertino Lawrence a la veta", "Travertino Silver a la veta", "Travertino Titanium", "Travertino Rojo"] },
  "Cuarzo Purastone": { s: "cuarzo", c: ["Blanco Nube", "Blanco Paloma", "Blanco Icon", "Statuario", "Pura Statuarietto", "Calacatta Gold", "Arabescato venatino", "Taj", "Gris Zen", "Cemento", "Concrete Sand", "Negro Betun"] },
  "Purastone Prima": { s: "piedra-sinterizada", c: ["Calacatta Borghini", "Calacatta Vagli", "Bianco Lasa", "Blanco Zen", "Taj Mahal", "Arabescato Wow", "Onyx White", "Limestone", "Metro Grey", "Marquina", "Lava Black", "Titanium Black"] },
  "Neolith": { s: "neolith", c: ["Calacatta Luxe", "Estatuario E01", "Calacatta C01", "Artic White", "Mont Blanc", "Pietra Di Luna", "Beton", "Cement", "Iron Grey", "Basalt Grey", "Nero", "Black Obsession"] },
  "Terrazzo": { s: "terrazzo", c: ["Berlin", "Arabescato Bianco", "Grigio Perla", "Verde Alpi", "Palladio Doge", "Palladio Fenice", "Palladio Griso", "Brera", "Maremma", "Magnolia", "Palladio Moro", "New York"] },
  "Corian": { s: "corian", c: ["Designer White", "Montelli Artic White", "Montelli Pearl White", "White Jasmine", "Clam Shell", "Dove", "Rain Cloud", "Ash Concrete", "Concrete", "Carbon Concrete", "Deep Espresso", "Deep Mink"] },
};
const NO_SE = "No sé, quiero que me asesoren";
const MATERIALES = [...Object.keys(MESADA_CATALOGO), NO_SE];
const USOS = ["Cocina", "Baño y vanitory", "Lavadero", "Barras y comercios", "Exterior y parrilla", "Otro"];
const FORMAS = ["Recta", "En L", "En U", "Isla", "Con desayunador", "Otra"];
const CALADOS = ["Bacha", "Anafe", "Grifería", "Zócalo", "Retirar la mesada vieja"];

const slug = (s) => (s || "item").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const muestra = (material, color) => `${IMG}/${MESADA_CATALOGO[material].s}/${slug(color)}-200.webp`;

const Label = ({ children }) => (
  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#151515]/[0.66] mb-2">{children}</p>
);

const Chip = ({ label, on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    className={`px-3.5 py-2 rounded-full border text-[13px] transition-colors ${
      on ? "border-[#151515] bg-[#151515] text-white" : "border-black/10 bg-[#FAFAF8] text-[#151515] hover:border-[#151515]"
    }`}
  >
    {label}
  </button>
);

// Texto corto para el WhatsApp, el resumen y la tabla.
export function resumenMesada(cfg = {}) {
  const parts = [];
  if (cfg.uso) parts.push(`Uso: ${cfg.uso}`);
  if (cfg.material) parts.push(`Material: ${cfg.material}${cfg.color ? ` · ${cfg.color}` : ""}`);
  if (cfg.forma) parts.push(`Forma: ${cfg.forma}`);
  if (cfg.calados?.length) parts.push(`Lleva: ${cfg.calados.join(", ")}`);
  return parts;
}

export default function MesadaFields({ config, update }) {
  const cat = MESADA_CATALOGO[config.material];
  const calados = config.calados || [];

  const elegirMaterial = (m) => {
    update("material", m);
    // El color de otra piedra no tiene sentido: se limpia.
    if (m !== config.material) update("color", "");
  };

  return (
    <div className="space-y-6 mb-6">
      <div>
        <Label>¿Para dónde es?</Label>
        <div className="flex flex-wrap gap-2">
          {USOS.map((u) => <Chip key={u} label={u} on={config.uso === u} onClick={() => update("uso", u)} />)}
        </div>
      </div>

      <div>
        <Label>Material</Label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {MATERIALES.map((m) => {
            const on = config.material === m;
            const c = MESADA_CATALOGO[m];
            return (
              <button
                key={m}
                type="button"
                onClick={() => elegirMaterial(m)}
                aria-pressed={on}
                className={`relative flex flex-col items-center gap-1.5 p-2 border rounded-sm text-center transition-colors min-w-0 ${
                  on ? "border-[#151515] bg-white" : "border-black/8 bg-[#FAFAF8] hover:border-[#151515]/50"
                }`}
              >
                {c ? (
                  <img src={muestra(m, c.c[0])} alt="" width="44" height="44" loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <span className="w-11 h-11 rounded-full border border-dashed border-black/25 flex items-center justify-center text-[18px] text-[#151515]/[0.66]">?</span>
                )}
                <span className="text-[11px] leading-tight text-[#151515] break-words">{c ? m : "No sé, asesorame"}</span>
                {on && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#151515] text-white flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {cat && (
        <div>
          <Label>Color {config.color ? `· ${config.color}` : "(opcional)"}</Label>
          <div className="flex items-start gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {cat.c.map((col) => {
              const on = config.color === col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => update("color", on ? "" : col)}
                  aria-pressed={on}
                  className="shrink-0 w-[76px] snap-start text-left flex flex-col justify-start self-start"
                >
                  <img
                    src={muestra(config.material, col)}
                    srcSet={`${muestra(config.material, col)} 200w, ${muestra(config.material, col).replace("-200.webp", "-400.webp")} 400w`}
                    sizes="76px"
                    alt=""
                    width="76"
                    height="76"
                    loading="lazy"
                    decoding="async"
                    className={`w-[76px] h-[76px] rounded-sm object-cover border-2 transition-colors ${on ? "border-[#151515]" : "border-transparent"}`}
                  />
                  <span className="block mt-1 text-[11px] leading-tight text-[#151515]/80">{col}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#151515]/[0.66] mt-1">Muestras orientativas. El asesor te muestra la placa real.</p>
        </div>
      )}

      <div>
        <Label>Forma (opcional)</Label>
        <div className="flex flex-wrap gap-2">
          {FORMAS.map((f) => <Chip key={f} label={f} on={config.forma === f} onClick={() => update("forma", config.forma === f ? "" : f)} />)}
        </div>
      </div>

      <div>
        <Label>¿Qué lleva? (opcional)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CALADOS.map((c) => (
            <CheckOption
              key={c}
              label={c}
              checked={calados.includes(c)}
              onChange={() => update("calados", calados.includes(c) ? calados.filter((x) => x !== c) : [...calados, c])}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
