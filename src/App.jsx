import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import { lazy, Suspense } from 'react';
// Consulta (la ve el vendedor) y Terminos se bajan aparte: el cliente que
// llega del anuncio solo descarga el cotizador.
const Consulta = lazy(() => import('./pages/Consulta'));
const Terminos = lazy(() => import('./pages/Terminos'));
const PageNotFound = lazy(() => import('./lib/PageNotFound'));

// Antes todo esto iba envuelto en el AuthProvider de Base44, que antes de
// mostrar nada consultaba /api/apps/... (restos de la plataforma vieja, ya
// no existe ese backend). El cotizador es publico y no tiene login: se
// muestra directo.
function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consulta/:id" element={<Suspense fallback={null}><Consulta /></Suspense>} />
          <Route path="/terminos" element={<Suspense fallback={null}><Terminos /></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><PageNotFound /></Suspense>} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
