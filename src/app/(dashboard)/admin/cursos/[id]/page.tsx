import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ChevronLeft, Plus, Edit2, Trash2, GripVertical, FileText, HelpCircle, Save } from "lucide-react"
import Link from "next/link"
import { updateCourseStatus } from "@/app/actions/courses"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const course = await prisma.course.findUnique({ where: { id } })
  return { title: course ? `Editar: ${course.title}` : "Editar Curso" }
}

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["ADMIN", "TEACHER"])
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: { orderBy: { sortOrder: "asc" } },
          evaluations: { orderBy: { sortOrder: "asc" } }
        }
      }
    }
  })

  if (!course) notFound()

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link 
            href="/admin/cursos"
            className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a cursos
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">{course.title}</h1>
            <Badge variant={course.status === "PUBLISHED" ? "success" : course.status === "DRAFT" ? "warning" : "neutral"}>
              {course.status === "PUBLISHED" ? "Publicado" : course.status === "DRAFT" ? "Borrador" : "Archivado"}
            </Badge>
          </div>
          <p className="text-neutral-500 font-mono text-sm mt-1">SKU: {course.sku}</p>
        </div>

        <div className="flex gap-3">
          <form action={async () => {
            "use server"
            await updateCourseStatus(course.id, course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")
          }}>
            <Button variant="outline" type="submit">
              {course.status === "PUBLISHED" ? "Ocultar Curso" : "Publicar Curso"}
            </Button>
          </form>
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Sections Builder */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Contenido del Curso</h2>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Añadir Sección
            </Button>
          </div>

          {course.sections.length > 0 ? (
            <div className="flex flex-col gap-4">
              {course.sections.map((section, index) => (
                <Card key={section.id} className="overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-neutral-400 cursor-move" />
                      <div>
                        <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                          Sección {index + 1}: {section.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:bg-danger-light hover:text-danger"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  {/* Section Items */}
                  <div className="flex flex-col divide-y divide-neutral-100">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="p-4 pl-12 flex items-center justify-between hover:bg-neutral-50 group">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-neutral-300 cursor-move" />
                          <FileText className="w-5 h-5 text-primary-500" />
                          <span className="font-medium text-neutral-700">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Editar</Button>
                        </div>
                      </div>
                    ))}

                    {section.evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="p-4 pl-12 flex items-center justify-between hover:bg-neutral-50 group">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-neutral-300 cursor-move" />
                          <HelpCircle className="w-5 h-5 text-warning" />
                          <span className="font-medium text-neutral-700">{evaluation.title}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Editar</Button>
                        </div>
                      </div>
                    ))}

                    {/* Add Item Actions */}
                    <div className="p-4 pl-12 bg-white flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs border-dashed">
                        + Lección
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs border-dashed">
                        + Evaluación
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
              <p className="text-neutral-500 mb-4">Este curso aún no tiene secciones.</p>
              <Button>Añadir Primera Sección</Button>
            </Card>
          )}
        </div>

        {/* Sidebar - Course Settings */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Configuración del Curso</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Título</label>
                <div className="font-medium text-neutral-900 mt-1">{course.title}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Categoría</label>
                <div className="font-medium text-neutral-900 mt-1">{course.category?.name || "Sin categoría"}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Nota Mínima</label>
                <div className="font-medium text-neutral-900 mt-1">{course.passingGrade}%</div>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Modo</label>
                <div className="font-medium text-neutral-900 mt-1">{course.isSequential ? "Secuencial" : "Libre"}</div>
              </div>
              
              <Button variant="outline" className="w-full mt-2">Editar Configuración</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
