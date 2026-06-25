import { Metadata } from "next"
import { requireAuth, getCurrentUser } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { BookOpen, Award, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "@/components/ui/ProgressBar"

export const metadata: Metadata = {
  title: "Panel",
}

export default async function StudentPanelPage() {
  const session = await requireAuth()
  const user = await getCurrentUser()

  // Fetch student stats
  const enrollmentsCount = await prisma.enrollment.count({
    where: { userId: session.userId },
  })

  const certificatesCount = await prisma.certificate.count({
    where: { userId: session.userId },
  })

  const completedLessonsCount = await prisma.lessonProgress.count({
    where: { userId: session.userId, completed: true },
  })

  // Fetch recent enrollments with course details
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    orderBy: { enrolledAt: "desc" },
    take: 3,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          sections: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      }
    }
  })

  // Calculate progress for recent enrollments
  const coursesWithProgress = await Promise.all(
    recentEnrollments.map(async (enrollment) => {
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
        status: enrollment.status,
        progress
      }
    })
  )

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">
          ¡Hola, {user?.firstName}!
        </h1>
        <p className="text-neutral-500">
          Bienvenido a tu panel de estudiante. Aquí tienes un resumen de tu progreso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Cursos Inscritos</p>
            <p className="text-2xl font-bold text-neutral-900">{enrollmentsCount}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-success-light text-success rounded-full">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Lecciones Completadas</p>
            <p className="text-2xl font-bold text-neutral-900">{completedLessonsCount}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-warning-light text-warning rounded-full">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Certificados</p>
            <p className="text-2xl font-bold text-neutral-900">{certificatesCount}</p>
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">Continuar aprendiendo</h2>
          <Link href="/mis-cursos" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Ver todos los cursos
          </Link>
        </div>

        {coursesWithProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithProgress.map((course) => (
              <Link key={course.id} href={`/cursos/${course.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="h-32 bg-primary-100 flex items-center justify-center relative">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-primary-300" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <h3 className="font-semibold text-neutral-900 line-clamp-2">{course.title}</h3>
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Progreso
                        </span>
                        <span className="font-medium text-neutral-900">{course.progress}%</span>
                      </div>
                      <ProgressBar progress={course.progress} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center flex flex-col items-center justify-center border-dashed">
            <BookOpen className="w-12 h-12 text-neutral-300 mb-3" />
            <p className="text-neutral-600 mb-4">Aún no estás inscrito en ningún curso.</p>
            <Link href="/cursos" className="text-primary-600 font-medium hover:underline">
              Explorar catálogo de cursos
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
