import { base44Config } from '@base44'

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Suplacard Landing</h1>
      <p className="text-slate-600">Proyecto Base44 listo para despliegue en Railway con Vite.</p>
      <p className="rounded bg-white px-4 py-2 text-sm text-slate-500 shadow">
        Módulo Base44 cargado: <strong>{base44Config.projectName}</strong>
      </p>
    </main>
  )
}

export default App
