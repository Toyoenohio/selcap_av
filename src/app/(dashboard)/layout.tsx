import { requireAuth } from "@/lib/dal"
import { getCurrentUser } from "@/lib/dal"
import { DashboardShell } from "@/components/layout/DashboardShell"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardShell user={user}>{children}</DashboardShell>
}
