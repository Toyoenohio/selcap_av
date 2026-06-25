import { Metadata } from "next"
import { requireAuth, getCurrentUser } from "@/lib/dal"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
  title: "Mi Perfil",
}

export default async function ProfilePage() {
  await requireAuth()
  const user = await getCurrentUser()

  if (!user) return null

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Mi Perfil</h1>
        <p className="text-neutral-500">Gestiona tu información personal y contraseña.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-6 mb-8">
          <Avatar 
            initials={`${user.firstName[0]}${user.lastName[0]}`} 
            src={user.avatarUrl}
            size="xl"
            className="w-24 h-24 text-2xl bg-primary-100 text-primary-700"
          />
          <div className="flex flex-col pt-2">
            <h2 className="text-2xl font-bold text-neutral-900">{user.firstName} {user.lastName}</h2>
            <p className="text-neutral-500">{user.email}</p>
            <div className="mt-2 inline-flex">
              <span className="px-2.5 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-md uppercase tracking-wider">
                {user.role === "ADMIN" ? "Administrador" : user.role === "TEACHER" ? "Profesor" : "Estudiante"}
              </span>
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-5 border-t border-neutral-200 pt-6">
          <h3 className="font-semibold text-lg text-neutral-900 mb-2">Datos Personales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nombre" 
              name="firstName" 
              defaultValue={user.firstName}
            />
            <Input 
              label="Apellido" 
              name="lastName" 
              defaultValue={user.lastName}
            />
          </div>
          
          <Input 
            label="Correo Electrónico" 
            name="email" 
            type="email"
            defaultValue={user.email}
            disabled
            helperText="Para cambiar tu correo electrónico, contacta al soporte."
          />

          <div className="flex justify-end mt-2">
            <Button type="button">Guardar Cambios</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <form className="flex flex-col gap-5">
          <h3 className="font-semibold text-lg text-neutral-900 mb-2">Cambiar Contraseña</h3>
          
          <Input 
            label="Contraseña Actual" 
            name="currentPassword" 
            type="password"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nueva Contraseña" 
              name="newPassword" 
              type="password"
            />
            <Input 
              label="Confirmar Nueva Contraseña" 
              name="confirmPassword" 
              type="password"
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button type="button" variant="outline">Actualizar Contraseña</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
