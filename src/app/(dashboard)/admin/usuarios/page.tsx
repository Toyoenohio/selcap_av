import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Gestión de Usuarios",
}

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"])

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">Usuarios</h1>
          <p className="text-neutral-500">Administra los usuarios de la plataforma.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Rol</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === "ADMIN" ? "danger" : user.role === "TEACHER" ? "primary" : "neutral"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="text-success text-xs font-medium">Activo</span>
                    ) : (
                      <span className="text-danger text-xs font-medium">Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
