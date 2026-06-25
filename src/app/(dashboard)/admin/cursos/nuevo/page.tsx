"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { createCourse } from "@/app/actions/courses"
import { AlertCircle } from "lucide-react"

const initialState: any = {
  error: "",
  success: false,
  courseId: "",
}

export default function NewCoursePage() {
  const router = useRouter()
  const [state, action, pending] = useActionState(createCourse as any, initialState)

  useEffect(() => {
    if (state?.success && state.courseId) {
      router.push(`/admin/cursos/${state.courseId}`)
    }
  }, [state, router])

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Nuevo Curso</h1>
        <p className="text-neutral-500">Completa los datos iniciales para crear un nuevo curso. Podrás agregar contenido en el siguiente paso.</p>
      </div>

      <Card className="p-6">
        <form action={action} className="flex flex-col gap-5">
          {state?.error && (
            <div className="bg-danger-light text-danger px-4 py-3 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

          <Input
            label="Título del Curso"
            name="title"
            placeholder="Ej: Curso de React Básico"
            required
          />

          <Input
            label="SKU (Identificador Único)"
            name="sku"
            placeholder="Ej: REACT-101"
            required
            helperText="Este ID se usa para sincronizar con WooCommerce."
          />

          <Textarea
            label="Descripción (Opcional)"
            name="description"
            placeholder="Describe de qué trata el curso..."
            rows={4}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={pending}>
              Crear y Continuar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
