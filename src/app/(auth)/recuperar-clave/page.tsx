import { Metadata } from "next"
import ForgotForm from "./forgot-form"

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Restablece tu contraseña",
}

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Recuperar Contraseña</h1>
        <p className="text-neutral-500">Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.</p>
      </div>
      <ForgotForm />
    </div>
  )
}
