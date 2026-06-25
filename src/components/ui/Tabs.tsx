"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: { id: string; label: string; content?: React.ReactNode }[]
  activeTab: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onChange, className, ...props }: TabsProps) {
  return (
    <div className={cn("flex flex-col w-full", className)} {...props}>
      <div className="flex border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "pt-4 animate-fade-in",
            activeTab === tab.id ? "block" : "hidden"
          )}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
