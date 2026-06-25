"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AlertCircle } from "lucide-react"

const initialState = {
  error: "",
  success: false,
  fields: {},
}

export default function RegisterForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(register, initialState)

  useEffect(() => {
    if (state?.success) {
      router.push("/panel")
    }
  }, [state, router])

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <div className="bg-danger-light text-danger px-4 py-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Input
          label="Nombre"
          name="firstName"
          placeholder="Ej: Juan"
          required
          error={state?.fields?.firstName?.[0]}
        />
        <Input
          label="Apellido"
          name="lastName"
          placeholder="Ej: Pérez"
          required
          error={state?.fields?.lastName?.[0]}
        />
      </div>

      <Input
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        required
        error={state?.fields?.email?.[0]}
      />

      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        error={state?.fields?.password?.[0]}
      />

      <Input
        label="Confirmar Contraseña"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        required
        error={state?.fields?.confirmPassword?.[0]}
      />

      <Button type="submit" className="w-full mt-2" isLoading={pending}>
        Crear Cuenta
      </Button>

      <div className="text-center mt-6 text-sm text-neutral-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-primary-600 font-medium hover:underline">
          Inicia sesión
        </Link>
      </div>
    </form>
  )
}
