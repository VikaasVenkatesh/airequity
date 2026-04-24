import { notFound } from "next/navigation"
import Link from "next/link"
import { BUILDINGS, SEED_COMPLAINTS, SEED_DIAGNOSES } from "@/lib/mock-data"
import { Building2, AlertTriangle, FlaskConical, ChevronRight } from "lucide-react"

export default async function BuildingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const building = BUILDINGS.find((b) => b.id === id)
  if (!building) notFound()

  const buildingComplaints = SEED_COMPLAINTS.filter((c) => c.buildingId === id)
  const buildingDiagnoses = SEED_DIAGNOSES.filter((d) => d.buildingId === id)

  return (
    <div className="min-h-full bg-zinc-950">
      {/* Top bar */}
      <div className="border-b border-zinc-900 px-8 py-5">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-zinc-200">{building.name}</span>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{building.name}</h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                {building.address} · {building.totalGsf.toLocaleString()} GSF
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/buildings/${id}/floors/4`}
              className="inline-flex items-center gap-2 rounded-lg bg-white text-zinc-950 px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              <FlaskConical className="h-4 w-4" />
              View floor plan
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl space-y-8">
        {/* Building meta */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Year opened", value: building.openedYear?.toString() ?? "—" },
            { label: "Floors", value: building.floors.length.toString() },
            { label: "Open complaints", value: buildingComplaints.filter((c) => c.status === "open").length.toString() },
            { label: "Diagnoses run", value: buildingDiagnoses.length.toString() },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Floor list */}
        <section>
          <h2 className="text-base font-semibold mb-4">Floors</h2>
          <div className="space-y-2">
            {building.floors.map((floor) => {
              const floorComplaints = buildingComplaints.filter((c) => c.floorId === floor.id)
              const openCount = floorComplaints.filter((c) => c.status === "open").length
              const highSeverity = floorComplaints.filter((c) => c.severity >= 4).length

              return (
                <Link
                  key={floor.id}
                  href={`/buildings/${id}/floors/${floor.number}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/20 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-300">
                      {floor.number === "0" ? "G" : floor.number}
                    </div>
                    <div>
                      <span className="font-medium text-zinc-200">{floor.label}</span>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {floor.rooms.length} rooms mapped
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {openCount > 0 ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-amber-400 font-medium">{openCount} open</span>
                        {highSeverity > 0 && (
                          <span className="text-red-400 text-xs">· {highSeverity} high severity</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">No complaints</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Diagnoses */}
        {buildingDiagnoses.length > 0 && (
          <section>
            <h2 className="text-base font-semibold mb-4">Recent diagnoses</h2>
            <div className="space-y-3">
              {buildingDiagnoses.map((diag) => (
                <Link
                  key={diag.id}
                  href={`/diagnoses/${diag.id}`}
                  className="block rounded-xl border border-zinc-900 bg-zinc-900/20 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <SeverityBadge level={diag.severityAssessment} />
                      <span className="text-sm font-medium capitalize">
                        {diag.hvacIssueType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{Math.round(diag.confidenceScore * 100)}% confidence</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{diag.rootCause}</p>
                  <p className="text-xs text-zinc-600 mt-2">
                    {diag.complaintIds.length} complaints · {new Date(diag.generatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function SeverityBadge({ level }: { level: string }) {
  const map = {
    low: "bg-emerald-950 text-emerald-400 border-emerald-800",
    moderate: "bg-amber-950 text-amber-400 border-amber-800",
    high: "bg-orange-950 text-orange-400 border-orange-800",
    critical: "bg-red-950 text-red-400 border-red-800",
  }
  const cls = map[level as keyof typeof map] ?? "bg-zinc-900 text-zinc-400 border-zinc-800"
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {level}
    </span>
  )
}
