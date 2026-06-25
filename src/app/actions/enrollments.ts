"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/dal"

export async function createEnrollment(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    
    const userId = formData.get("userId") as string
    const courseId = formData.get("courseId") as string
    
    if (!userId || !courseId) {
      return { error: "Usuario y Curso son obligatorios." }
    }

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      update: {
        status: "ACTIVE"
      },
      create: {
        userId,
        courseId,
        source: "MANUAL",
        status: "ACTIVE"
      }
    })

    revalidatePath("/admin/inscripciones")
    return { success: true }
  } catch (error) {
    console.error("Error enrolling user:", error)
    return { error: "Error al inscribir usuario." }
  }
}
