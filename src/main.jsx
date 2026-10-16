import '@/index.css'

// La barra y el inicio ya vienen dibujados en index.html. La app (React, el formulario,
// ~190 KB) se baja y arranca recien despues del primer dibujo: si se ejecutaba antes,
// en algunos celus frenaba la primera pintada y Google marcaba la pagina lenta.
// El formulario esta debajo del inicio, asi que nadie llega a notar la espera.
const arrancar = () => import('./arranque.jsx')

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => setTimeout(arrancar, 0)))
} else {
  requestAnimationFrame(() => setTimeout(arrancar, 0))
}
