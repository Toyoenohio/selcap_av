"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AlertCircle } from "lucide-react"

const initialState = {
  error: "",
  success: false,
  role: "",
  fields: {},
}

export default function LoginForm() {
  const router = useRouter()
  // Ensure we cast to any for React 19 useActionState compatibility if needed, though it should be typed properly in a real project
  const [state, action, pending] = useActionState(login as any, initialState)

  useEffect(() => {
    if (state?.success) {
      if (state.role === "ADMIN" || state.role === "TEACHER") {
        router.push("/admin")
      } else {
        router.push("/panel")
      }
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

      <div className="flex flex-col gap-4">
        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          required
          error={state?.fields?.email?.[0]}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-neutral-700">Contraseña</label>
            <Link 
              href="/recuperar-clave" 
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={state?.fields?.password?.[0]}
          />
        </div>
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={pending}>
        Iniciar Sesión
      </Button>

      <div className="text-center mt-6 text-sm text-neutral-600">
        ¿No tienes una cuenta?{" "}
        <Link href="/registro" className="text-primary-600 font-medium hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </form>
  )
}
