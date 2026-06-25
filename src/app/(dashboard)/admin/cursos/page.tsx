import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { Plus, Edit2, Trash2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Gestión de Cursos",
}

export default async function AdminCoursesPage() {
  await requireRole(["ADMIN", "TEACHER"])

  const courses = await prisma.course.findMany({
    include: {
      category: true,
      teacher: { select: { firstName: true, lastName: true } },
      _count: { select: { enrollments: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">Cursos</h1>
          <p className="text-neutral-500">Administra el catálogo de cursos.</p>
        </div>
        <Link href="/admin/cursos/nuevo">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Curso
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-6 py-3 font-medium">SKU / ID</th>
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Profesor</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-center">Alumnos</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{course.sku}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{course.title}</div>
                    {course.category && (
                      <div className="text-neutral-500 text-xs mt-0.5">{course.category.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : "Sin asignar"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={course.status === "PUBLISHED" ? "success" : course.status === "DRAFT" ? "warning" : "neutral"}
                    >
                      {course.status === "PUBLISHED" ? "Publicado" : course.status === "DRAFT" ? "Borrador" : "Archivado"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-neutral-900">
                    {course._count.enrollments}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/cursos/${course.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4 text-neutral-500" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-danger-light hover:text-danger">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    No hay cursos creados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
