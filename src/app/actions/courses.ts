"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/dal"

export async function createCourse(prevState: any, formData: FormData) {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    
    const rawData = Object.fromEntries(formData)
    
    // For MVP, just simple server validation
    if (!rawData.title || !rawData.sku) {
      return { error: "El título y SKU son obligatorios." }
    }

    const course = await prisma.course.create({
      data: {
        title: rawData.title as string,
        sku: rawData.sku as string,
        description: rawData.description as string || "",
        categoryId: rawData.categoryId ? rawData.categoryId as string : null,
        status: "DRAFT",
      },
    })

    revalidatePath("/admin/cursos")
    return { success: true, courseId: course.id }
  } catch (error) {
    console.error("Error creating course:", error)
    return { error: "Error al crear el curso." }
  }
}

export async function updateCourseStatus(courseId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  try {
    await requireRole(["ADMIN", "TEACHER"])
    
    await prisma.course.update({
      where: { id: courseId },
      data: { status }
    })
    
    revalidatePath("/admin/cursos")
    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
  } catch (error) {
    return { error: "Error al actualizar estado." }
  }
}
