"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, FileText, Brain, Wind, Map } from "lucide-react"

const navItems = [
  { href: "/dashboard",                    label: "Dashboard",    icon: LayoutDashboard, section: "main" },
  { href: "/buildings/432",               label: "Iribe Center", icon: Building2,       section: "buildings" },
  { href: "/buildings/432/floors/4",      label: "Floor 4",      icon: Map,             section: "buildings" },
  { href: "/buildings/432/floors/5",      label: "Floor 5",      icon: Map,             section: "buildings" },
  { href: "/diagnoses/diag-001",          label: "Diagnoses",    icon: Brain,           section: "tools" },
  { href: "/complaints/new",              label: "File complaint",icon: FileText,        section: "tools" },
]

export function Sidebar() {
  const pathname = usePathname()

  const sections = [
    { key: "main",      label: null },
    { key: "buildings", label: "Buildings" },
    { key: "tools",     label: "Tools" },
  ]

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full border-r border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 opacity-90" />
            <div className="relative h-full w-full rounded-lg flex items-center justify-center">
              <Wind className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight gradient-text-cyan">AirEquity</span>
            <span className="block text-xs text-zinc-600 leading-none mt-0.5">UMD Facilities</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-auto space-y-5">
        {sections.map(({ key, label }) => {
          const items = navItems.filter((n) => n.section === key)
          return (
            <div key={key}>
              {label && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  {label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(({ href, label: itemLabel, icon: Icon }) => {
                  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
                        isActive
                          ? "bg-white/[0.07] text-white"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? "text-cyan-400" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                      {itemLabel}
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer status */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Building 432</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-700">215,600 GSF · 6 floors</p>
          <p className="text-xs text-zinc-700">Updated Apr 24, 2026</p>
        </div>
      </div>
    </aside>
  )
}
