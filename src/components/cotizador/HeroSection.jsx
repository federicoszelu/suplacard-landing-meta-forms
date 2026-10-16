import React, { useEffect } from "react";

/* Hero con la misma arquitectura que suplacard.com:
   foto a sangre completa, degradado oscuro encima y el texto sobre
   la imagen. Nada de columna partida.

   Las tres fotos son las de las paginas de producto del sitio, asi
   no se duplican archivos y siempre coinciden con la web. */
// Fotos propias de este dominio (public/img, generadas desde los originales de
// suplacard.com en alta resolucion). El navegador elige el tamano justo para la
// pantalla: en el celu un recorte vertical de 640 o 1000 px, en compu 1280/1920/2560.
// Antes el celu estiraba un 900x1200 muy comprimido y se veia pixelado.
const SLIDES = [
  { n: "hero-placards",   alt: "Placard a medida fabricado por Suplacard" },
  { n: "hero-cocinas",    alt: "Cocina a medida fabricada por Suplacard" },
  { n: "hero-vestidores", alt: "Vestidor a medida fabricado por Suplacard" },
].map((s) => ({
  ...s,
  src: `/img/${s.n}-1920.webp`,
  srcSet: `/img/${s.n}-1280.webp 1280w, /img/${s.n}-1920.webp 1920w, /img/${s.n}-2560.webp 2560w`,
  srcSetM: `/img/${s.n}-m-640.webp 640w, /img/${s.n}-m-800.webp 800w, /img/${s.n}-m-1000.webp 1000w`,
}));

const DURACION = 5000;

const DATOS = [
  { n: "+30",      l: "Años de trayectoria" },
  { n: "5",        l: "Showrooms en CABA y GBA" },
  { n: "+10.000",  l: "Proyectos entregados" },
  { n: "Propia",   l: "Fábrica en Buenos Aires" },
];

export default function HeroSection({ onStart }) {
  // El hero (fotos, texto y boton) ya viene dibujado en index.html (#hero, fuera de
  // #root): asi Google cuenta el titulo al primer dibujo y React no lo reemplaza
  // despues por uno nuevo, que era lo que marcaba el contenido principal tarde.
  // Aca solo se le da vida: el pase de fotos (la 2 y la 3 se piden a los 3 s), los
  // puntos y el boton. Si se cambia el texto o la foto, cambiarlo en index.html.
  useEffect(() => {
    const cont = document.getElementById("hero-slides");
    if (!cont) return undefined;
    const dots = [...document.querySelectorAll("#hero-dots button")];
    const imgs = [cont.querySelector("img")];
    let i = 0, pausado = false, timer = null;
    const pintar = () => {
      imgs.forEach((im, k) => { im.style.opacity = k === i ? "1" : "0"; });
      dots.forEach((d, k) => {
        d.style.width = k === i ? "34px" : "16px";
        d.style.background = k === i ? "#FFFFFF" : "rgba(255,255,255,0.4)";
      });
    };
    dots.forEach((d, k) => { d.onclick = () => { if (imgs[k]) { i = k; pausado = true; pintar(); } }; });
    const start = document.getElementById("hero-start");
    if (start) start.onclick = onStart;
    const t = setTimeout(() => {
      SLIDES.slice(1).forEach((s) => {
        const pic = document.createElement("picture");
        const src = document.createElement("source");
        src.media = "(max-width: 800px)"; src.srcset = s.srcSetM; src.sizes = "100vw";
        const im = document.createElement("img");
        im.src = s.src; im.srcset = s.srcSet; im.sizes = "100vw"; im.alt = s.alt; im.decoding = "async";
        im.className = "absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out";
        im.style.opacity = "0";
        pic.append(src, im);
        cont.appendChild(pic);
        imgs.push(im);
      });
      timer = setInterval(() => { if (!pausado) { i = (i + 1) % imgs.length; pintar(); } }, DURACION);
    }, 3000);
    return () => { clearTimeout(t); clearInterval(timer); if (start) start.onclick = null; };
  }, [onStart]);

  return (
    <>
      {/* Franja de cifras, separada del hero como en el sitio */}
      <section className="border-b" style={{ borderColor: "#E4E0DB", background: "#FFFFFF" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-14 lg:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {DATOS.map((d) => (
              <div key={d.l}>
                <div
                  style={{
                    fontSize: "clamp(2.1rem, 4vw, 3.2rem)",
                    fontWeight: 200,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: "#111111",
                  }}
                >
                  {d.n}
                </div>
                <div
                  style={{
                    fontSize: "0.64rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#767676",
                    marginTop: "1rem",
                  }}
                >
                  {d.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
