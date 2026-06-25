"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"

export async function submitEvaluation(prevState: any, formData: FormData) {
  try {
    const session = await requireAuth()
    
    const evaluationId = formData.get("evaluationId") as string
    if (!evaluationId) return { error: "ID de evaluación no válido" }

    // Fetch the evaluation with questions and correct answers
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        section: { select: { courseId: true } },
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    if (!evaluation) return { error: "Evaluación no encontrada" }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0

    evaluation.questions.forEach(question => {
      totalPoints += question.points
      
      // Get the user's answer from form data
      const userAnswerIds = formData.getAll(`question_${question.id}`) as string[]
      
      // Basic check for SINGLE_CHOICE or TRUE_FALSE
      if (question.type === "SINGLE_CHOICE" || question.type === "TRUE_FALSE") {
        const correctAnswers = question.answers.filter(a => a.isCorrect).map(a => a.id)
        
        if (userAnswerIds.length > 0 && correctAnswers.includes(userAnswerIds[0])) {
          earnedPoints += question.points
        }
      }
      // Note: MULTIPLE_CHOICE would require checking if all correct answers are selected and no incorrect ones
    })

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    
    // For MVP, passing score is course.passingGrade, but we need to fetch it
    const course = await prisma.course.findUnique({
      where: { id: evaluation.section.courseId }
    })
    
    const passed = score >= (course?.passingGrade || 70)

    // Save attempt
    const attempt = await prisma.evaluationAttempt.create({
      data: {
        userId: session.userId,
        evaluationId: evaluation.id,
        score,
        passed
      }
    })

    if (passed && course) {
      // Check if all lessons are completed
      const allLessons = await prisma.lesson.findMany({
        where: { section: { courseId: course.id } }
      })
      
      const completedLessons = await prisma.lessonProgress.findMany({
        where: { userId: session.userId, completed: true, lesson: { section: { courseId: course.id } } }
      })

      // Check if all evaluations are passed
      const allEvaluations = await prisma.evaluation.findMany({
        where: { section: { courseId: course.id } }
      })

      const passedEvaluations = await prisma.evaluationAttempt.findMany({
        where: { userId: session.userId, passed: true, evaluation: { section: { courseId: course.id } } }
      })

      // Ensure user has passed at least one attempt for every evaluation
      const uniquePassedEvaluationIds = new Set(passedEvaluations.map(e => e.evaluationId))

      if (
        allLessons.length === completedLessons.length &&
        allEvaluations.every(e => uniquePassedEvaluationIds.has(e.id))
      ) {
        // Complete enrollment
        await prisma.enrollment.update({
          where: { userId_courseId: { userId: session.userId, courseId: course.id } },
          data: { status: "COMPLETED" }
        })

        // Generate Certificate if it doesn't exist
        const existingCert = await prisma.certificate.findFirst({
          where: { userId: session.userId, courseId: course.id }
        })

        if (!existingCert) {
          // Calculate final average grade based on all evaluations
          let finalGrade = score
          if (uniquePassedEvaluationIds.size > 0) {
            // Get best score per evaluation
            const bestScores = new Map<string, number>()
            passedEvaluations.forEach(e => {
              const currentBest = bestScores.get(e.evaluationId) || 0
              if (e.score > currentBest) bestScores.set(e.evaluationId, e.score)
            })
            // If the current attempt is better, update it in our map
            if (score > (bestScores.get(evaluation.id) || 0)) {
              bestScores.set(evaluation.id, score)
            }
            
            const totalScore = Array.from(bestScores.values()).reduce((a, b) => a + b, 0)
            finalGrade = totalScore / bestScores.size
          }

          const certNumber = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          
          await prisma.certificate.create({
            data: {
              userId: session.userId,
              courseId: course.id,
              certificateNumber: certNumber,
              finalGrade,
              certificateUrl: `/api/certificates/download?id=` // will be built dynamically
            }
          })
        }
      }
    }

    revalidatePath(`/evaluacion/${evaluation.id}`)
    revalidatePath(`/cursos/${course?.id}`)
    
    return { 
      success: true, 
      score, 
      passed,
      attemptId: attempt.id
    }
  } catch (error) {
    console.error("Evaluation submission error:", error)
    return { error: "Hubo un error al procesar tu evaluación." }
  }
}
