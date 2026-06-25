import { Metadata } from "next"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { BookOpen, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Catálogo de Cursos",
}

export default async function CourseCatalogPage() {
  const session = await requireAuth()

  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      teacher: { select: { firstName: true, lastName: true } },
      _count: { select: { sections: true, enrollments: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  // Get enrolled course IDs for current user
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    select: { courseId: true, status: true }
  })
  const enrolledMap = new Map(enrollments.map(e => [e.courseId, e.status]))

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Catálogo de Cursos</h1>
        <p className="text-neutral-500">
          Explora los cursos disponibles y comienza a aprender hoy.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center gap-4 border-dashed">
          <BookOpen className="w-12 h-12 text-neutral-300" />
          <div>
            <p className="text-neutral-600 font-medium">No hay cursos disponibles</p>
            <p className="text-sm text-neutral-500 mt-1">Vuelve pronto. El equipo está preparando nuevo contenido.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrollment = enrolledMap.get(course.id)
            const isEnrolled = !!enrollment
            const isCompleted = enrollment === "COMPLETED"

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Header gradient */}
                <div className="h-36 bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center relative">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                  ) : (
                    <BookOpen className="w-14 h-14 text-primary-200" />
                  )}
                  {course.category && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded">
                      {course.category.name}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-lg leading-tight line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-neutral-500 line-clamp-2">{course.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 mt-auto pt-4 border-t border-neutral-100">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course._count.sections} secciones
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course._count.enrollments} alumnos
                    </span>
                  </div>

                  {course.teacher && (
                    <p className="text-xs text-neutral-400">
                      Prof. {course.teacher.firstName} {course.teacher.lastName}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    {isEnrolled ? (
                      <>
                        <Badge variant={isCompleted ? "success" : "primary"}>
                          {isCompleted ? "Completado" : "Inscrito"}
                        </Badge>
                        <Link href={`/cursos/${course.id}`} className="ml-auto">
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                            {isCompleted ? "Ver certificado" : "Continuar"} <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </>
                    ) : (
                      <Link href={`/cursos/${course.id}`} className="w-full">
                        <span className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                          Ver curso <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
