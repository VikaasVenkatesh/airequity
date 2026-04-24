import Link from "next/link"
import type { Building, Complaint } from "@/lib/types"
import { Building2, ChevronRight } from "lucide-react"

interface BuildingCardProps {
  building: Building
  complaints: Complaint[]
}

export function BuildingCard({ building, complaints }: BuildingCardProps) {
  const open     = complaints.filter((c) => c.status === "open").length
  const high     = complaints.filter((c) => c.severity >= 4).length
  const resolved = complaints.filter((c) => c.status === "resolved").length

  const aqStatus =
    high >= 3 ? "critical" : high >= 1 ? "warning" : open > 0 ? "moderate" : "good"

  const statusConfig = {
    good:     { dot: "bg-emerald-400", ring: "shadow-[0_0_10px_rgba(52,211,153,0.4)]", label: "Good",            badge: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50" },
    moderate: { dot: "bg-amber-400",   ring: "shadow-[0_0_10px_rgba(251,191,36,0.4)]",  label: "Moderate",        badge: "bg-amber-950/60 text-amber-400 border-amber-800/50" },
    warning:  { dot: "bg-orange-400",  ring: "shadow-[0_0_10px_rgba(251,146,60,0.4)]",  label: "Needs attention", badge: "bg-orange-950/60 text-orange-400 border-orange-800/50" },
    critical: { dot: "bg-red-400",     ring: "shadow-[0_0_10px_rgba(248,113,113,0.4)]", label: "Critical",        badge: "bg-red-950/60 text-red-400 border-red-800/50" },
  }
  const status = statusConfig[aqStatus]

  return (
    <Link
      href={`/buildings/${building.id}`}
      className="card-hover gradient-border group block rounded-xl glass p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-zinc-400" />
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.ring}`} />
          {status.label}
        </span>
      </div>

      <h3 className="font-semibold text-zinc-100 leading-tight group-hover:text-white transition-colors">
        {building.name}
      </h3>
      <p className="text-xs text-zinc-600 mt-1">{building.address}</p>

      {/* Complaint bars */}
      <div className="mt-4 space-y-2">
        {[
          { label: "Open", value: open, max: Math.max(open, 1), color: "bg-amber-500" },
          { label: "High sev.", value: high, max: Math.max(high, 1), color: "bg-red-500" },
          { label: "Resolved", value: resolved, max: Math.max(resolved, 1), color: "bg-emerald-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 w-16 flex-shrink-0">{label}</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: value > 0 ? `${Math.min((value / 7) * 100, 100)}%` : "0%" }}
              />
            </div>
            <span className="text-xs text-zinc-500 w-4 text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-600">
        <span>{building.floors.length} floors · {(building.totalGsf / 1000).toFixed(0)}k GSF</span>
        <ChevronRight className="h-3.5 w-3.5 group-hover:text-zinc-400 transition-colors" />
      </div>
    </Link>
  )
}
