import Link from "next/link"
import { BUILDINGS, SEED_COMPLAINTS, SEED_DIAGNOSES } from "@/lib/mock-data"
import { BuildingCard } from "@/components/buildings/building-card"
import { AuroraBg } from "@/components/shell/aurora-bg"
import { Wind, AlertTriangle, CheckCircle, Activity, Brain, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const totalComplaints = SEED_COMPLAINTS.length
  const openComplaints = SEED_COMPLAINTS.filter((c) => c.status === "open").length
  const criticalComplaints = SEED_COMPLAINTS.filter((c) => c.severity >= 4).length
  const resolvedComplaints = SEED_COMPLAINTS.filter((c) => c.status === "resolved").length

  return (
    <div className="relative min-h-full">
      <AuroraBg />
      <div className="relative z-10">

        {/* Hero header */}
        <div className="border-b border-white/5 px-8 py-7">
          <div className="flex items-center justify-between">
            <div className="animate-fade-up stagger-1">
              <p className="text-xs font-medium text-cyan-400/80 uppercase tracking-widest mb-1">
                University of Maryland · Facilities Management
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                Air Quality{" "}
                <span className="gradient-text-cyan">Intelligence</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 animate-fade-up stagger-2">
              <div className="flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Live monitoring</span>
              </div>
              <Link
                href="/complaints/new"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-zinc-950 transition-colors"
              >
                + File complaint
              </Link>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 max-w-7xl space-y-10">

          {/* Bento stat grid */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              icon={<Activity className="h-4 w-4" />}
              label="Total reported"
              value={totalComplaints}
              color="cyan"
              delay="stagger-1"
            />
            <StatCard
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Open complaints"
              value={openComplaints}
              color="amber"
              delay="stagger-2"
            />
            <StatCard
              icon={<Wind className="h-4 w-4" />}
              label="High severity"
              value={criticalComplaints}
              color="red"
              delay="stagger-3"
            />
            <StatCard
              icon={<CheckCircle className="h-4 w-4" />}
              label="Resolved"
              value={resolvedComplaints}
              color="green"
              delay="stagger-4"
            />
          </div>

          {/* Buildings + diagnosis bento */}
          <div className="grid grid-cols-3 gap-5">
            {/* Buildings — 2 cols */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between animate-fade-up stagger-2">
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Buildings</h2>
                <Link href="/buildings/432" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {BUILDINGS.map((building, i) => {
                  const bc = SEED_COMPLAINTS.filter((c) => c.buildingId === building.id)
                  return (
                    <div key={building.id} className={`animate-fade-up stagger-${i + 2}`}>
                      <BuildingCard building={building} complaints={bc} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Diagnoses panel — 1 col */}
            <div className="space-y-4">
              <div className="flex items-center justify-between animate-fade-up stagger-2">
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">AI Diagnoses</h2>
              </div>
              <div className="space-y-3">
                {SEED_DIAGNOSES.map((d, i) => (
                  <Link
                    key={d.id}
                    href={`/diagnoses/${d.id}`}
                    className={`card-hover gradient-border block rounded-xl glass p-4 animate-fade-up stagger-${i + 3}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-950/80 border border-violet-800/50 flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-violet-300 capitalize">
                          {d.hvacIssueType.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{d.rootCause}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
                            d.severityAssessment === "high" ? "bg-orange-950/60 border-orange-800/50 text-orange-400" :
                            d.severityAssessment === "critical" ? "bg-red-950/60 border-red-800/50 text-red-400" :
                            "bg-amber-950/60 border-amber-800/50 text-amber-400"
                          }`}>
                            {d.severityAssessment}
                          </span>
                          <span className="text-xs text-zinc-600">{Math.round(d.confidenceScore * 100)}% conf.</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Quick action card */}
                <Link
                  href="/buildings/432/floors/4"
                  className="card-hover block rounded-xl border border-dashed border-white/10 p-4 text-center hover:border-cyan-800/50 transition-colors animate-fade-up stagger-5"
                >
                  <TrendingUp className="h-5 w-5 text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-zinc-500">Run new diagnosis</p>
                  <p className="text-xs text-zinc-700 mt-0.5">Floor 4 · {openComplaints} open</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent complaints table */}
          <section className="animate-fade-up stagger-4">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Recent complaints</h2>
            <div className="rounded-xl overflow-hidden glass gradient-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">Room</th>
                    <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">Symptoms</th>
                    <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">Severity</th>
                    <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {SEED_COMPLAINTS.slice(0, 7).map((c, i) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/buildings/432/floors/4?room=${c.roomNumber}`}
                          className="font-medium text-zinc-200 hover:text-cyan-300 transition-colors"
                        >
                          Room {c.roomNumber}
                        </Link>
                        <div className="text-xs text-zinc-600 mt-0.5">Iribe · Floor 4</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {c.symptoms.slice(0, 2).map((s) => (
                            <span key={s} className="inline-block rounded-md bg-white/5 border border-white/8 px-1.5 py-0.5 text-xs text-zinc-400 capitalize">
                              {s.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <SeverityBar severity={c.severity} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-600">
                        {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, delay }: {
  icon: React.ReactNode
  label: string
  value: number
  color: "cyan" | "amber" | "red" | "green"
  delay: string
}) {
  const configs = {
    cyan:  { bg: "from-cyan-950/60 to-cyan-950/20",  border: "border-cyan-800/30",  icon: "bg-cyan-900/60 text-cyan-400",  val: "text-cyan-300"  },
    amber: { bg: "from-amber-950/60 to-amber-950/20", border: "border-amber-800/30", icon: "bg-amber-900/60 text-amber-400", val: "text-amber-300" },
    red:   { bg: "from-red-950/60 to-red-950/20",     border: "border-red-800/30",   icon: "bg-red-900/60 text-red-400",     val: "text-red-300"   },
    green: { bg: "from-emerald-950/60 to-emerald-950/20", border: "border-emerald-800/30", icon: "bg-emerald-900/60 text-emerald-400", val: "text-emerald-300" },
  }
  const cfg = configs[color]
  return (
    <div className={`card-hover animate-fade-up ${delay} rounded-xl bg-gradient-to-br ${cfg.bg} border ${cfg.border} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</span>
        <div className={`h-7 w-7 rounded-lg ${cfg.icon} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold tabular-nums animate-count-up ${cfg.val}`}>{value}</p>
    </div>
  )
}

function SeverityBar({ severity }: { severity: number }) {
  const color = severity >= 4 ? "bg-red-500" : severity >= 3 ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${(severity / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs text-zinc-600 tabular-nums">{severity}/5</span>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map = {
    open:      "bg-amber-950/60 text-amber-400 border-amber-800/50",
    diagnosed: "bg-violet-950/60 text-violet-400 border-violet-800/50",
    resolved:  "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
  }
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${map[status as keyof typeof map] ?? "bg-zinc-900 text-zinc-400 border-zinc-800"}`}>
      {status}
    </span>
  )
}
