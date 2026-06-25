import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/dal"
import { jsPDF } from "jspdf"
import { formatDate } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: true,
        course: true
      }
    })

    if (!certificate) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    // Only allow admins, teachers, or the owner to download
    if (session.role === "STUDENT" && certificate.userId !== session.userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Create a new PDF document (landscape orientation)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    })

    // Dimensions: 297 x 210 mm
    const width = doc.internal.pageSize.getWidth()
    const height = doc.internal.pageSize.getHeight()

    // Background color (Primary color from our theme #297EBE -> rgb(41, 126, 190))
    doc.setFillColor(245, 247, 250) // Light gray background
    doc.rect(0, 0, width, height, "F")

    // Add a decorative border
    doc.setDrawColor(41, 126, 190) // Primary color
    doc.setLineWidth(4)
    doc.rect(10, 10, width - 20, height - 20)

    // Inner border
    doc.setDrawColor(41, 126, 190)
    doc.setLineWidth(0.5)
    doc.rect(15, 15, width - 30, height - 30)

    // Title
    doc.setTextColor(30, 41, 59) // slate-800
    doc.setFont("helvetica", "bold")
    doc.setFontSize(36)
    doc.text("CERTIFICADO DE FINALIZACIÓN", width / 2, 50, { align: "center" })

    // Subtitle
    doc.setFont("helvetica", "normal")
    doc.setFontSize(16)
    doc.setTextColor(100, 116, 139) // slate-500
    doc.text("Se otorga el presente certificado a:", width / 2, 75, { align: "center" })

    // Student Name
    doc.setFont("helvetica", "bold")
    doc.setFontSize(32)
    doc.setTextColor(41, 126, 190) // Primary
    doc.text(`${certificate.user.firstName} ${certificate.user.lastName}`.toUpperCase(), width / 2, 100, { align: "center" })

    // Course statement
    doc.setFont("helvetica", "normal")
    doc.setFontSize(16)
    doc.setTextColor(100, 116, 139)
    doc.text("Por haber completado exitosamente los requisitos del curso:", width / 2, 125, { align: "center" })

    // Course Name
    doc.setFont("helvetica", "bold")
    doc.setFontSize(24)
    doc.setTextColor(30, 41, 59)
    doc.text(certificate.course.title.toUpperCase(), width / 2, 145, { align: "center" })

    // Details
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(100, 116, 139)
    doc.text(`Fecha de emisión: ${formatDate(certificate.issuedAt)}`, 40, 180)
    doc.text(`Calificación final: ${certificate.finalGrade.toFixed(1)}%`, 40, 190)
    
    // Certificate Number
    doc.setFont("helvetica", "italic")
    doc.setFontSize(10)
    doc.text(`ID: ${certificate.certificateNumber}`, 40, 200)

    // Signature Area
    doc.setDrawColor(30, 41, 59)
    doc.setLineWidth(0.5)
    doc.line(width - 100, 180, width - 40, 180)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Dirección Académica", width - 70, 190, { align: "center" })

    // Get the PDF as a buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    // Return the response as a downloadable PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Certificado_${certificate.course.title.replace(/\s+/g, "_")}.pdf"`
      }
    })

  } catch (error) {
    console.error("Error generating certificate:", error)
    return NextResponse.json({ error: "Error al generar el certificado" }, { status: 500 })
  }
}
