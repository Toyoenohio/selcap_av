import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Categorías",
}

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN", "TEACHER"])

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { courses: true } }
    },
    orderBy: { sortOrder: "asc" }
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">Categorías</h1>
          <p className="text-neutral-500">Agrupa los cursos en categorías temáticas.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Categoría
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-6 py-3 font-medium">Nombre</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium text-center">Cursos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-medium text-neutral-900">
                  {category.name}
                  {category.description && (
                    <p className="text-neutral-500 text-xs font-normal mt-1">{category.description}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-neutral-500 font-mono text-xs">{category.slug}</td>
                <td className="px-6 py-4 text-center text-neutral-900 font-medium">{category._count.courses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
