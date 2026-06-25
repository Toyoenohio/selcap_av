import React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-neutral-50">
      {/* Left side - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary-900 to-primary-600 p-12 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]" />
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]" />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Aula Virtual</span>
          </Link>
          
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Aprende a tu propio ritmo
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed">
            Accede a cientos de cursos, completa evaluaciones y obtén certificados para impulsar tu carrera profesional.
          </p>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">Aula Virtual</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}
