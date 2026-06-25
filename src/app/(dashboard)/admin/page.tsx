import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { BookOpen, Users, GraduationCap, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Panel",
}

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN", "TEACHER"])

  const [coursesCount, usersCount, enrollmentsCount, certificatesCount] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count({ where: { status: "ACTIVE" } }),
    prisma.certificate.count()
  ])

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 5,
    orderBy: { enrolledAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      course: { select: { title: true } }
    }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Panel de Administración</h1>
        <p className="text-neutral-500">Resumen general del Aula Virtual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Cursos</p>
            <p className="text-2xl font-bold text-neutral-900">{coursesCount}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-success-light text-success rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Alumnos</p>
            <p className="text-2xl font-bold text-neutral-900">{usersCount}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-warning-light text-warning rounded-full">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Inscripciones</p>
            <p className="text-2xl font-bold text-neutral-900">{enrollmentsCount}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-info-light text-info rounded-full">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Certificados</p>
            <p className="text-2xl font-bold text-neutral-900">{certificatesCount}</p>
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Inscripciones Recientes</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Alumno</th>
                  <th className="px-6 py-3 font-medium">Curso</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentEnrollments.map((enrollment) => (
                  <tr key={`${enrollment.userId}-${enrollment.courseId}`} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">
                        {enrollment.user.firstName} {enrollment.user.lastName}
                      </div>
                      <div className="text-neutral-500 text-xs">{enrollment.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{enrollment.course.title}</td>
                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(enrollment.enrolledAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))}
                {recentEnrollments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                      No hay inscripciones recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
