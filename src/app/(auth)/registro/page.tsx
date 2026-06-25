import { Metadata } from "next"
import RegisterForm from "./register-form"

export const metadata: Metadata = {
  title: "Registro",
  description: "Crea una cuenta para acceder a los cursos",
}

export default function RegisterPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Crear Cuenta</h1>
        <p className="text-neutral-500">Completa tus datos para registrarte en la plataforma.</p>
      </div>
      <RegisterForm />
    </div>
  )
}
