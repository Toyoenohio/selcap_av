import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { generateTempPassword } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const secret = process.env.N8N_WEBHOOK_SECRET

    // Simple Bearer token authentication
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado. Token inválido." }, { status: 401 })
    }

    const data = await req.json()
    const { email, firstName, lastName, courseSku } = data

    if (!email || !courseSku) {
      return NextResponse.json({ error: "Faltan campos requeridos: email, courseSku" }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    let isNewUser = false
    let rawPassword = ""

    if (!user) {
      rawPassword = generateTempPassword()
      const passwordHash = await bcrypt.hash(rawPassword, 12)
      
      user = await prisma.user.create({
        data: {
          email,
          firstName: firstName || "Estudiante",
          lastName: lastName || "",
          passwordHash,
          role: "STUDENT",
        },
      })
      isNewUser = true
    }

    // Find course by SKU
    const course = await prisma.course.findUnique({
      where: { sku: courseSku },
    })

    if (!course) {
      return NextResponse.json({ error: `Curso no encontrado con SKU: ${courseSku}` }, { status: 404 })
    }

    // Create enrollment
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        userId: user.id,
        courseId: course.id,
        source: "N8N_AUTOMATION",
        status: "ACTIVE",
      },
    })

    // Here you can trigger email notifications
    // if (isNewUser) { sendWelcomeEmail(...) } else { sendEnrollmentEmail(...) }

    return NextResponse.json({
      success: true,
      message: `Usuario inscrito exitosamente en ${course.title}`,
      userCreated: isNewUser,
      user: {
        email: user.email,
        firstName: user.firstName,
      },
      course: {
        sku: course.sku,
        title: course.title
      }
    })
  } catch (error) {
    console.error("N8N Webhook error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
