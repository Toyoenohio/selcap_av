"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { submitEvaluation } from "@/app/actions/evaluations"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const initialState = {
  error: "",
  success: false,
  score: 0,
  passed: false,
}

export function EvaluationForm({ evaluation, courseId }: { evaluation: any, courseId: string }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(submitEvaluation, initialState)

  // If successfully submitted, show results
  if (state?.success) {
    return (
      <Card className="p-8 text-center animate-fade-in max-w-2xl mx-auto mt-8">
        <div className="flex justify-center mb-6">
          {state.passed ? (
            <div className="w-24 h-24 bg-success-light text-success rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-danger-light text-danger rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12" />
            </div>
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">
          {state.passed ? "¡Felicitaciones!" : "No has aprobado"}
        </h2>
        
        <p className="text-xl text-neutral-600 mb-6">
          Tu calificación final es: <span className="font-bold text-neutral-900">{state.score.toFixed(0)}%</span>
        </p>
        
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          {state.passed 
            ? "Has superado la evaluación exitosamente. Puedes continuar con el curso." 
            : "No te preocupes, puedes volver a intentarlo y repasar el contenido de las lecciones anteriores."}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={`/cursos/${courseId}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              Volver al Curso
            </Button>
          </Link>
          {!state.passed && (
            <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
              Intentar de nuevo
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-8 max-w-3xl mx-auto pb-12">
      {state?.error && (
        <div className="bg-danger-light text-danger px-4 py-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <input type="hidden" name="evaluationId" value={evaluation.id} />

      {evaluation.questions.map((question: any, index: number) => (
        <Card key={question.id} className="p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            <span className="text-primary-600 mr-2">{index + 1}.</span>
            {question.text}
          </h3>
          
          <div className="flex flex-col gap-3">
            {question.answers.map((answer: any) => (
              <label 
                key={answer.id} 
                className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
              >
                <div className="flex h-6 items-center">
                  <input
                    type={question.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                    name={`question_${question.id}`}
                    value={answer.id}
                    className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                    required={question.type !== "MULTIPLE_CHOICE"}
                  />
                </div>
                <div className="text-neutral-700 font-medium">
                  {answer.text}
                </div>
              </label>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-neutral-200 shadow-sm sticky bottom-4">
        <Link href={`/cursos/${courseId}`}>
          <Button type="button" variant="ghost">Cancelar</Button>
        </Link>
        <Button type="submit" size="lg" isLoading={pending}>
          Enviar Respuestas
        </Button>
      </div>
    </form>
  )
}
