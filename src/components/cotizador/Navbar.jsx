import { useEffect } from "react";

// La barra ya viene dibujada en index.html (#nav, fuera de #root) para que se vea
// al instante. Este componente no dibuja nada: solo le da comportamiento (fondo al
// bajar y el boton "Cotizar ahora"). Si se cambia la barra, cambiarla en index.html.
const AL_BAJAR = ["bg-[#F9F8F6]/90", "backdrop-blur-xl", "border-b", "border-black/5", "shadow-sm"];

export default function Navbar({ onCotizar }) {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const boton = document.getElementById("nav-cotizar");
    if (!nav) return undefined;
    const handler = () => {
      const bajo = window.scrollY > 20;
      AL_BAJAR.forEach((c) => nav.classList.toggle(c, bajo));
      nav.classList.toggle("bg-transparent", !bajo);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    if (boton) boton.onclick = onCotizar;
    return () => {
      window.removeEventListener("scroll", handler);
      if (boton) boton.onclick = null;
    };
  }, [onCotizar]);

  return null;
}
