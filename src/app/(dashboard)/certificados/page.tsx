import { Metadata } from "next"
import { requireAuth } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Award, Download, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
  title: "Mis Certificados",
}

export default async function CertificatesPage() {
  const session = await requireAuth()

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.userId },
    orderBy: { issuedAt: "desc" },
    include: {
      course: {
        select: {
          title: true,
          thumbnailUrl: true,
        }
      }
    }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Mis Certificados</h1>
        <p className="text-neutral-500">Descarga los certificados de los cursos que has completado.</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden flex flex-col group">
              <div className="h-32 bg-gradient-to-r from-primary-900 to-primary-700 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute opacity-10 -right-4 -bottom-4">
                  <Award className="w-32 h-32" />
                </div>
                <Award className="w-8 h-8 relative z-10 text-primary-200" />
                <div className="relative z-10">
                  <p className="text-xs font-medium text-primary-200 uppercase tracking-wider mb-1">
                    Certificado de Finalización
                  </p>
                  <p className="font-bold text-lg leading-tight line-clamp-1" title={cert.course.title}>
                    {cert.course.title}
                  </p>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4 bg-white flex-1">
                <div className="flex flex-col gap-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>Emitido: {formatDate(cert.issuedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Calificación:</span>
                    <span className="font-bold text-neutral-900">{cert.finalGrade.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nº Certificado:</span>
                    <span className="font-mono text-xs text-neutral-500">{cert.certificateNumber}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-neutral-100">
                  <a href={`/api/certificates/${cert.id}/download`} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
          <div className="bg-neutral-100 p-4 rounded-full mb-4">
            <Award className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Aún no tienes certificados</h3>
          <p className="text-neutral-500 mb-6 max-w-md">
            Completa todas las lecciones y aprueba las evaluaciones de tus cursos para obtener certificados.
          </p>
        </Card>
      )}
    </div>
  )
}
