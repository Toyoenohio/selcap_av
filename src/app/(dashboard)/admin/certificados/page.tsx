import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Certificados Emitidos",
}

export default async function AdminCertificatesPage() {
  await requireRole(["ADMIN", "TEACHER"])

  const certificates = await prisma.certificate.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { issuedAt: "desc" }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Certificados Emitidos</h1>
        <p className="text-neutral-500">Historial de todos los certificados generados en la plataforma.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-6 py-3 font-medium">Nº Certificado</th>
                <th className="px-6 py-3 font-medium">Alumno</th>
                <th className="px-6 py-3 font-medium">Curso</th>
                <th className="px-6 py-3 font-medium text-center">Nota</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{cert.certificateNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {cert.user.firstName} {cert.user.lastName}
                    </div>
                    <div className="text-neutral-500 text-xs">{cert.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{cert.course.title}</td>
                  <td className="px-6 py-4 text-center font-bold text-neutral-900">{cert.finalGrade.toFixed(1)}%</td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">
                    {new Date(cert.issuedAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={`/api/certificates/${cert.id}/download`} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                        <Download className="w-4 h-4 mr-1" /> PDF
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    No se han emitido certificados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
