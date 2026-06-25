import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { generateTempPassword } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = req.headers.get("x-wc-webhook-signature")
    const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET

    // Verify webhook signature if secret is provided
    if (secret && signature) {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("base64")

      if (signature !== generatedSignature) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    }

    const data = JSON.parse(payload)

    // WooCommerce 'order.completed' payload
    if (data.status !== "completed") {
      return NextResponse.json({ message: "Order not completed, skipping." })
    }

    const { billing, line_items } = data
    const email = billing.email
    const firstName = billing.first_name || "Usuario"
    const lastName = billing.last_name || ""

    if (!email) {
      return NextResponse.json({ error: "No email provided in order" }, { status: 400 })
    }

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
          firstName,
          lastName,
          passwordHash,
          role: "STUDENT",
        },
      })
      isNewUser = true
    }

    const enrolledCourses = []

    // Process each line item to find matching courses by SKU (which acts as the course ID per user request)
    for (const item of line_items) {
      const sku = item.sku

      if (!sku) continue

      const course = await prisma.course.findUnique({
        where: { sku },
      })

      if (course) {
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
            source: "WOOCOMMERCE",
            status: "ACTIVE",
          },
        })
        
        enrolledCourses.push(course.title)
      }
    }

    // Here we would trigger the emails:
    // If isNewUser: send WelcomeEmail with email + rawPassword
    // If not: send EnrollmentEmail with the courses

    return NextResponse.json({
      success: true,
      userCreated: isNewUser,
      enrolledCourses,
    })
  } catch (error) {
    console.error("WooCommerce Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
