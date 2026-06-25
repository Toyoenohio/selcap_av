"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  LayoutDashboard, 
  GraduationCap, 
  Award, 
  User, 
  Settings, 
  Users, 
  FolderTree, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Compass
} from "lucide-react"
import { logout } from "@/app/actions/auth"
import { Avatar } from "@/components/ui/Avatar"

interface SidebarProps {
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
    avatarUrl?: string | null
  }
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ user, isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  
  const studentNav = [
    { name: "Panel", href: "/panel", icon: LayoutDashboard },
    { name: "Catálogo", href: "/cursos", icon: Compass },
    { name: "Mis Cursos", href: "/mis-cursos", icon: GraduationCap },
    { name: "Certificados", href: "/certificados", icon: Award },
    { name: "Perfil", href: "/perfil", icon: User },
  ]
  
  const adminNav = [
    { name: "Panel Admin", href: "/admin", icon: LayoutDashboard },
    { name: "Cursos", href: "/admin/cursos", icon: BookOpen },
    { name: "Categorías", href: "/admin/categorias", icon: FolderTree },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
    { name: "Inscripciones", href: "/admin/inscripciones", icon: GraduationCap },
    { name: "Certificados", href: "/admin/certificados", icon: Award },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
  ]
  
  const navItems = (user.role === "ADMIN" || user.role === "TEACHER") && pathname.startsWith("/admin") 
    ? adminNav 
    : studentNav

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[68px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 shrink-0">
          <Link href={user.role === "ADMIN" ? "/admin" : "/panel"} className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary-600 p-1.5 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg text-neutral-900 whitespace-nowrap animate-fade-in">
                Aula Virtual
              </span>
            )}
          </Link>
          
          <button 
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative group",
                  isActive 
                    ? "bg-primary-50 text-primary-600 font-medium" 
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-600" : "text-neutral-500 group-hover:text-neutral-700")} />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-neutral-200 shrink-0">
          <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center" : "")}>
            <Avatar 
              initials={`${user.firstName[0]}${user.lastName[0]}`} 
              src={user.avatarUrl} 
              size="sm"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-neutral-900 truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-neutral-500 truncate">
                  {user.role === "ADMIN" ? "Administrador" : user.role === "TEACHER" ? "Profesor" : "Estudiante"}
                </span>
              </div>
            )}
          </div>
          
          <form action={logout}>
            <button 
              type="submit"
              className={cn(
                "flex items-center gap-3 py-2 text-sm font-medium text-neutral-600 hover:text-danger w-full rounded-md hover:bg-danger-light/50 transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3"
              )}
              title={isCollapsed ? "Cerrar Sesión" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
