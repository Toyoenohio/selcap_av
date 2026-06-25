"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call for now (can be connected to server action later)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="text-center animate-fade-in py-6">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">¡Correo enviado!</h2>
        <p className="text-neutral-500 mb-6">
          Si el correo está registrado en nuestra plataforma, recibirás un enlace para restablecer tu contraseña.
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Volver al inicio de sesión
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        required
      />

      <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
        Enviar Instrucciones
      </Button>

      <div className="text-center mt-6 text-sm text-neutral-600">
        <Link href="/login" className="text-primary-600 font-medium hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  )
}
