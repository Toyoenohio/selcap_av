import { Metadata } from "next"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { BookOpen, CheckCircle, PlayCircle, Clock, Award } from "lucide-react"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const course = await prisma.course.findUnique({ where: { id } })
  return { title: course?.title || "Curso" }
}

export default async function CourseOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.userId,
        courseId: id
      }
    }
  })

  if (!enrollment && session.role !== "ADMIN" && session.role !== "TEACHER") {
    // If not enrolled and not admin, redirect to catalog (which we don't have yet, so dashboard)
    redirect("/panel")
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { firstName: true, lastName: true } },
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: { orderBy: { sortOrder: "asc" } },
          evaluations: { orderBy: { sortOrder: "asc" } }
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  // Get user progress
  const completedLessons = await prisma.lessonProgress.findMany({
    where: { userId: session.userId, completed: true }
  })
  const completedLessonIds = new Set(completedLessons.map(p => p.lessonId))

  const completedEvaluations = await prisma.evaluationAttempt.findMany({
    where: { userId: session.userId, passed: true }
  })
  const completedEvaluationIds = new Set(completedEvaluations.map(e => e.evaluationId))

  // Calculate stats
  let totalItems = 0
  let completedItems = 0
  let firstUncompletedLessonId: string | null = null

  course.sections.forEach(section => {
    section.lessons.forEach(lesson => {
      totalItems++
      if (completedLessonIds.has(lesson.id)) {
        completedItems++
      } else if (!firstUncompletedLessonId) {
        firstUncompletedLessonId = lesson.id
      }
    })
    
    section.evaluations.forEach(evaluation => {
      totalItems++
      if (completedEvaluationIds.has(evaluation.id)) {
        completedItems++
      }
    })
  })

  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100)

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-5xl mx-auto">
      {/* Course Header */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
        <div className="h-48 md:h-64 bg-gradient-to-br from-primary-900 to-primary-700 relative flex items-center justify-center">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
          ) : (
            <BookOpen className="w-24 h-24 text-primary-300 opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            {course.teacher && (
              <p className="text-primary-100 flex items-center gap-2">
                <UserIcon /> Profesor: {course.teacher.firstName} {course.teacher.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex-1 w-full max-w-xl">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-neutral-700">Tu progreso</span>
              <span className="text-primary-600">{progress}%</span>
            </div>
            <ProgressBar value={progress} className="h-3" />
            <p className="text-sm text-neutral-500 mt-2">
              Has completado {completedItems} de {totalItems} actividades.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            {progress === 100 ? (
              <Link href="/certificados">
                <Button variant="primary" className="w-full md:w-auto flex items-center gap-2" size="lg">
                  <Award className="w-5 h-5" /> Ver Certificado
                </Button>
              </Link>
            ) : firstUncompletedLessonId ? (
              <Link href={`/leccion/${firstUncompletedLessonId}`}>
                <Button className="w-full md:w-auto flex items-center gap-2" size="lg">
                  <PlayCircle className="w-5 h-5" /> Continuar Aprendiendo
                </Button>
              </Link>
            ) : (
              <Button disabled className="w-full md:w-auto" size="lg">
                Sin contenido
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Acerca de este curso</h2>
            <div className="prose prose-neutral max-w-none text-neutral-600">
              {course.description ? (
                <p>{course.description}</p>
              ) : (
                <p className="italic text-neutral-400">Sin descripción disponible.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-neutral-900 px-1">Contenido del Curso</h2>
            
            {course.sections.length > 0 ? (
              <div className="flex flex-col gap-4">
                {course.sections.map((section, index) => (
                  <Card key={section.id} className="overflow-hidden">
                    <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900">{section.title}</h3>
                        {section.description && (
                          <p className="text-sm text-neutral-500">{section.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col divide-y divide-neutral-100">
                      {section.lessons.map((lesson) => {
                        const isCompleted = completedLessonIds.has(lesson.id)
                        return (
                          <Link 
                            key={lesson.id} 
                            href={`/leccion/${lesson.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors group"
                          >
                            <div className="shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-success" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 group-hover:border-primary-400 transition-colors" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                                <PlayCircle className="w-3.5 h-3.5" /> Lección
                              </div>
                            </div>
                          </Link>
                        )
                      })}

                      {section.evaluations.map((evaluation) => {
                        const isCompleted = completedEvaluationIds.has(evaluation.id)
                        return (
                          <Link 
                            key={evaluation.id} 
                            href={`/evaluacion/${evaluation.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors group"
                          >
                            <div className="shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-success" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 group-hover:border-primary-400 transition-colors" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                                {evaluation.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                                <Award className="w-3.5 h-3.5 text-warning" /> Evaluación
                              </div>
                            </div>
                          </Link>
                        )
                      })}

                      {section.lessons.length === 0 && section.evaluations.length === 0 && (
                        <div className="p-6 text-center text-neutral-500 text-sm">
                          Esta sección aún no tiene contenido.
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200 border-dashed">
                <p className="text-neutral-500">El profesor aún está preparando el contenido de este curso.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Detalles</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Modo de avance</p>
                  <p className="text-neutral-500">{course.isSequential ? "Secuencial (Paso a paso)" : "Libre"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Nota mínima aprobatoria</p>
                  <p className="text-neutral-500">{course.passingGrade}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Total lecciones</p>
                  <p className="text-neutral-500">{totalItems}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
