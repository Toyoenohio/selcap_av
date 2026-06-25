import { Metadata } from "next"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Inicia sesión en tu cuenta para acceder a tus cursos",
}

export default function LoginPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">¡Bienvenido de vuelta!</h1>
        <p className="text-neutral-500">Ingresa tus credenciales para acceder a tu cuenta.</p>
      </div>
      <LoginForm />
    </div>
  )
}
