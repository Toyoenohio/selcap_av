import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Inscripciones",
}

export default async function AdminEnrollmentsPage() {
  await requireRole(["ADMIN", "TEACHER"])

  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      course: { select: { title: true, sku: true } }
    },
    orderBy: { enrolledAt: "desc" }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">Inscripciones</h1>
          <p className="text-neutral-500">Gestiona los alumnos inscritos en los cursos.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Inscribir Alumno
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-6 py-3 font-medium">Alumno</th>
                <th className="px-6 py-3 font-medium">Curso</th>
                <th className="px-6 py-3 font-medium">Fuente</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {enrollments.map((enrollment) => (
                <tr key={`${enrollment.userId}-${enrollment.courseId}`} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {enrollment.user.firstName} {enrollment.user.lastName}
                    </div>
                    <div className="text-neutral-500 text-xs">{enrollment.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{enrollment.course.title}</div>
                    <div className="text-neutral-500 text-xs font-mono">{enrollment.course.sku}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={enrollment.source === "WOOCOMMERCE" ? "primary" : "neutral"}>
                      {enrollment.source === "WOOCOMMERCE" ? "Tienda" : "Manual"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={enrollment.status === "COMPLETED" ? "success" : enrollment.status === "ACTIVE" ? "primary" : "danger"}>
                      {enrollment.status === "COMPLETED" ? "Completado" : enrollment.status === "ACTIVE" ? "Activo" : "Cancelado"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-neutral-500 text-xs">
                    {new Date(enrollment.enrolledAt).toLocaleDateString("es-ES")}
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
