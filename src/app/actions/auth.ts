"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/auth"
import { loginSchema, registerSchema } from "@/lib/validations"

export async function login(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData)
    const validatedData = loginSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        error: "Por favor, revisa los datos ingresados.",
        fields: validatedData.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedData.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return { error: "Credenciales inválidas o cuenta inactiva." }
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return { error: "Credenciales inválidas." }
    }

    await createSession(user.id, user.role)
    
    // Will redirect after success, but we must do it outside try/catch if we want Next.js to handle it properly or just return success
    return { success: true, role: user.role }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Ocurrió un error inesperado." }
  }
}

export async function register(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData)
    const validatedData = registerSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        error: "Por favor, revisa los datos ingresados.",
        fields: validatedData.error.flatten().fieldErrors,
      }
    }

    const { firstName, lastName, email, password } = validatedData.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "El correo electrónico ya está en uso." }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: "STUDENT",
      },
    })

    await createSession(user.id, user.role)

    return { success: true }
  } catch (error) {
    console.error("Register error:", error)
    return { error: "Ocurrió un error inesperado." }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
