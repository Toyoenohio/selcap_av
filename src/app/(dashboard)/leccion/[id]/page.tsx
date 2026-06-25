import { Metadata } from "next"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { CheckCircle, ChevronLeft, ChevronRight, Video } from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  return { title: lesson?.title || "Lección" }
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params

  // Fetch lesson with section and course
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      section: {
        include: {
          course: {
            include: {
              sections: {
                orderBy: { sortOrder: "asc" },
                include: {
                  lessons: { orderBy: { sortOrder: "asc" } },
                  evaluations: { orderBy: { sortOrder: "asc" } }
                }
              }
            }
          }
        }
      }
    }
  })

  if (!lesson) {
    notFound()
  }

  const course = lesson.section.course

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.userId,
        courseId: course.id
      }
    }
  })

  if (!enrollment && session.role !== "ADMIN" && session.role !== "TEACHER") {
    redirect("/panel")
  }

  // Check if completed
  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.userId,
        lessonId: lesson.id
      }
    }
  })
  
  const isCompleted = progress?.completed || false

  // Find next/prev items for navigation
  const allItems: { id: string; type: "lesson" | "evaluation"; title: string }[] = []
  
  course.sections.forEach(section => {
    section.lessons.forEach(l => allItems.push({ id: l.id, type: "lesson", title: l.title }))
    section.evaluations.forEach(e => allItems.push({ id: e.id, type: "evaluation", title: e.title }))
  })

  const currentIndex = allItems.findIndex(item => item.id === lesson.id && item.type === "lesson")
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  // Server action to mark as complete
  const markComplete = async () => {
    "use server"
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.userId,
          lessonId: lesson.id
        }
      },
      update: { completed: true },
      create: {
        userId: session.userId,
        lessonId: lesson.id,
        completed: true
      }
    })
    
    revalidatePath(`/leccion/${lesson.id}`)
    revalidatePath(`/cursos/${course.id}`)
    
    // Redirect to next item if exists
    if (nextItem) {
      if (nextItem.type === "lesson") {
        redirect(`/leccion/${nextItem.id}`)
      } else {
        redirect(`/evaluacion/${nextItem.id}`)
      }
    } else {
      redirect(`/cursos/${course.id}`)
    }
  }

  return (
    <div className="flex flex-col animate-fade-in max-w-4xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href={`/cursos/${course.id}`}
          className="text-sm font-medium text-neutral-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al curso
        </Link>
        <div className="text-sm text-neutral-500">
          Sección: <span className="font-medium text-neutral-900">{lesson.section.title}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex-1 flex flex-col">
        {/* Video Player Placeholder if URL exists */}
        {lesson.videoUrl && (
          <div className="aspect-video bg-neutral-900 flex items-center justify-center relative group">
            {/* For a real app, integrate a proper video player like react-player or native video tag */}
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-white">
              <Video className="w-16 h-16 opacity-50 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm font-medium opacity-80">Video Player (Integración pendiente)</p>
              <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-xs underline text-primary-300">
                Ver en origen
              </a>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-10 flex-1">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{lesson.title}</h1>
            {isCompleted && (
              <span className="flex items-center gap-2 text-success bg-success-light px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Completada
              </span>
            )}
          </div>

          <div 
            className="prose prose-neutral prose-primary max-w-none prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-primary-700"
            dangerouslySetInnerHTML={{ __html: lesson.contentHtml || "<p>Esta lección no tiene contenido de texto.</p>" }}
          />
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          {prevItem ? (
            <Link href={`/${prevItem.type === 'lesson' ? 'leccion' : 'evaluacion'}/${prevItem.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
            </Link>
          ) : (
            <div className="w-full sm:w-auto" />
          )}

          <div className="flex gap-3 w-full sm:w-auto">
            {!isCompleted ? (
              <form action={markComplete} className="w-full sm:w-auto">
                <Button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Marcar como completada
                  {nextItem && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            ) : nextItem ? (
              <Link href={`/${nextItem.type === 'lesson' ? 'leccion' : 'evaluacion'}/${nextItem.id}`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
                  Siguiente <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/cursos/${course.id}`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
                  Finalizar Curso <Award className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
