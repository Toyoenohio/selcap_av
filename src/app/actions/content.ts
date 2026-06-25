"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/dal"

// ─── Sections ────────────────────────────────────────────

export async function createSection(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    const courseId = formData.get("courseId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string || ""

    if (!courseId || !title) {
      return { error: "El curso y título son obligatorios." }
    }

    const count = await prisma.section.count({ where: { courseId } })
    await prisma.section.create({
      data: { courseId, title, description: description || null, sortOrder: count }
    })

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating section:", error)
    return { error: "Error al crear la sección." }
  }
}

export async function deleteSection(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    const sectionId = formData.get("sectionId") as string
    const courseId = formData.get("courseId") as string

    if (!sectionId) return { error: "ID de sección no válido" }

    await prisma.section.delete({ where: { id: sectionId } })

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting section:", error)
    return { error: "Error al eliminar la sección." }
  }
}

// ─── Lessons ─────────────────────────────────────────────

export async function createLesson(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    const sectionId = formData.get("sectionId") as string
    const courseId = formData.get("courseId") as string
    const title = formData.get("title") as string
    const contentHtml = formData.get("contentHtml") as string || ""
    const videoUrl = formData.get("videoUrl") as string || ""

    if (!sectionId || !title) {
      return { error: "La sección y título son obligatorios." }
    }

    const count = await prisma.lesson.count({ where: { sectionId } })
    await prisma.lesson.create({
      data: {
        sectionId,
        title,
        contentHtml,
        videoUrl: videoUrl || null,
        sortOrder: count
      }
    })

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating lesson:", error)
    return { error: "Error al crear la lección." }
  }
}

export async function deleteLesson(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    const lessonId = formData.get("lessonId") as string
    const courseId = formData.get("courseId") as string

    if (!lessonId) return { error: "ID de lección no válido" }

    await prisma.lesson.delete({ where: { id: lessonId } })

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return { error: "Error al eliminar la lección." }
  }
}

// ─── Evaluations ─────────────────────────────────────────

export async function createEvaluation(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    const sectionId = formData.get("sectionId") as string
    const courseId = formData.get("courseId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string || ""
    const maxAttempts = parseInt(formData.get("maxAttempts") as string || "3")

    if (!sectionId || !title) {
      return { error: "La sección y título son obligatorios." }
    }

    const count = await prisma.evaluation.count({ where: { sectionId } })
    await prisma.evaluation.create({
      data: {
        sectionId,
        title,
        description: description || null,
        maxAttempts,
        sortOrder: count
      }
    })

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return { error: "Error al crear la evaluación." }
  }
}

export async function deleteEvaluation(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    const evaluationId = formData.get("evaluationId") as string
    const courseId = formData.get("courseId") as string

    if (!evaluationId) return { error: "ID de evaluación no válido" }

    await prisma.evaluation.delete({ where: { id: evaluationId } })

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting evaluation:", error)
    return { error: "Error al eliminar la evaluación." }
  }
}
