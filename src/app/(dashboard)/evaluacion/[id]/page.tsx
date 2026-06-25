import { Metadata } from "next"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { EvaluationForm } from "./evaluation-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const evaluation = await prisma.evaluation.findUnique({ where: { id } })
  return { title: evaluation?.title || "Evaluación" }
}

export default async function EvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params

  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: {
      section: {
        include: {
          course: true
        }
      },
      questions: {
        orderBy: { sortOrder: "asc" },
        include: {
          answers: {
            orderBy: { sortOrder: "asc" },
            // We intentionally DO NOT send isCorrect to the client
            select: { id: true, text: true }
          }
        }
      }
    }
  })

  if (!evaluation) notFound()

  const course = evaluation.section.course

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

  // Check past attempts
  const pastAttempts = await prisma.evaluationAttempt.findMany({
    where: {
      userId: session.userId,
      evaluationId: evaluation.id
    },
    orderBy: { startedAt: "desc" }
  })

  const hasPassed = pastAttempts.some(a => a.passed)
  const attemptsCount = pastAttempts.length

  if (evaluation.maxAttempts && attemptsCount >= evaluation.maxAttempts && !hasPassed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-neutral-200">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Límite de intentos alcanzado</h2>
        <p className="text-neutral-500 mb-6">Has alcanzado el número máximo de intentos ({evaluation.maxAttempts}) para esta evaluación.</p>
        <Link href={`/cursos/${course.id}`}>
          <Button>Volver al curso</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="max-w-3xl mx-auto w-full mb-8">
        <Link 
          href={`/cursos/${course.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al curso
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{evaluation.title}</h1>
        {evaluation.description && (
          <p className="text-neutral-500 text-lg">{evaluation.description}</p>
        )}
        
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-200">
          <div className="text-sm">
            <span className="text-neutral-500">Preguntas:</span>{" "}
            <span className="font-bold text-neutral-900">{evaluation.questions.length}</span>
          </div>
          {evaluation.maxAttempts && (
            <div className="text-sm">
              <span className="text-neutral-500">Intentos disponibles:</span>{" "}
              <span className="font-bold text-neutral-900">
                {evaluation.maxAttempts - attemptsCount} de {evaluation.maxAttempts}
              </span>
            </div>
          )}
          {hasPassed && (
            <div className="text-sm bg-success-light text-success px-2 py-0.5 rounded font-medium">
              Ya aprobada
            </div>
          )}
        </div>
      </div>

      <EvaluationForm evaluation={evaluation} courseId={course.id} />
    </div>
  )
}
