import { Metadata } from "next"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Badge } from "@/components/ui/Badge"

export const metadata: Metadata = {
  title: "Mis Cursos",
}

export default async function MyCoursesPage() {
  const session = await requireAuth()

  // Fetch all enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    orderBy: { enrolledAt: "desc" },
    include: {
      course: {
        include: {
          category: true,
          teacher: { select: { firstName: true, lastName: true } },
          sections: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      }
    }
  })

  // Calculate progress for each
  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = enrollment.course
      const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0)
      
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: session.userId,
          completed: true,
          lesson: { section: { courseId: course.id } }
        }
      })
      
      const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
      
      return {
        id: course.id,
        title: course.title,
        thumbnailUrl: course.thumbnailUrl,
        category: course.category?.name,
        teacherName: course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : null,
        status: enrollment.status,
        progress
      }
    })
  )

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Mis Cursos</h1>
        <p className="text-neutral-500">Aquí puedes ver y continuar todos los cursos en los que estás inscrito.</p>
      </div>

      {coursesWithProgress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithProgress.map((course) => (
            <Link key={course.id} href={`/cursos/${course.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group">
                <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-bold text-primary-300 opacity-50 group-hover:scale-110 transition-transform duration-300">
                      {course.title.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute top-3 right-3">
                    {course.status === "COMPLETED" ? (
                      <Badge variant="success">Completado</Badge>
                    ) : course.progress > 0 ? (
                      <Badge variant="info">En progreso</Badge>
                    ) : (
                      <Badge variant="neutral">No iniciado</Badge>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  {course.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                      {course.category}
                    </span>
                  )}
                  <h3 className="font-bold text-neutral-900 text-lg leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                  {course.teacherName && (
                    <p className="text-sm text-neutral-500">
                      Instructor: {course.teacherName}
                    </p>
                  )}
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Progreso
                      </span>
                      <span className="font-medium text-neutral-900">{course.progress}%</span>
                    </div>
                    <ProgressBar value={course.progress} variant={course.status === "COMPLETED" ? "success" : "primary"} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
          <div className="bg-neutral-100 p-4 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No tienes cursos</h3>
          <p className="text-neutral-500 mb-6 max-w-md">
            Parece que aún no estás inscrito en ningún curso. Visita nuestro catálogo para encontrar el curso perfecto para ti.
          </p>
          <Link href="/cursos" className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors">
            Explorar catálogo
          </Link>
        </Card>
      )}
    </div>
  )
}
