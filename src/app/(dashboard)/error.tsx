'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <div className="bg-danger-light text-danger p-4 rounded-full">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900">Algo salió mal</h2>
      <p className="text-neutral-500 text-center max-w-md text-sm">
        {error.message || 'Ocurrió un error al cargar esta sección. Verifica que la base de datos esté conectada y las variables de entorno configuradas.'}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
      >
        <RefreshCw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  )
}
