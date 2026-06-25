'use client'

import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="bg-danger-light text-danger p-5 rounded-full">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Error del sistema</h1>
          <p className="text-neutral-500 text-sm">
            La aplicación encontró un error crítico. 
            Verifica que <code className="bg-neutral-100 px-1 rounded">DATABASE_URL</code> y{' '}
            <code className="bg-neutral-100 px-1 rounded">JWT_SECRET</code> estén configurados en Vercel.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
