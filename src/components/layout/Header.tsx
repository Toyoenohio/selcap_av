"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

interface HeaderProps {
  onToggleMobileSidebar: () => void
  breadcrumbs: { label: string; href?: string }[]
}

export function Header({ onToggleMobileSidebar, breadcrumbs }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 lg:px-8 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-neutral-100 text-neutral-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:block">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Additional header items like notifications could go here */}
      </div>
    </header>
  )
}
