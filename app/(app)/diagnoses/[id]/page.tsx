import { notFound } from "next/navigation"
import Link from "next/link"
import { SEED_DIAGNOSES, SEED_COMPLAINTS, BUILDINGS } from "@/lib/mock-data"
import { ChevronRight, CheckCircle, AlertTriangle, Brain, Download } from "lucide-react"
import { PrintButton } from "@/components/diagnosis/print-button"

export default async function DiagnosisPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const diag = SEED_DIAGNOSES.find((d) => d.id === id)
  if (!diag) notFound()

  const building = BUILDINGS.find((b) => b.id === diag.buildingId)
  const floor = building?.floors.find((f) => f.id === diag.floorId)
  const complaints = SEED_COMPLAINTS.filter((c) => diag.complaintIds.includes(c.id))

  const severityMap = {
    low: { cls: "bg-emerald-950 text-emerald-400 border-emerald-800", label: "Low" },
    moderate: { cls: "bg-amber-950 text-amber-400 border-amber-800", label: "Moderate" },
    high: { cls: "bg-orange-950 text-orange-400 border-orange-800", label: "High" },
    critical: { cls: "bg-red-950 text-red-400 border-red-800", label: "Critical" },
  }
  const sevStyle = severityMap[diag.severityAssessment as keyof typeof severityMap]

  return (
    <div className="min-h-full bg-zinc-950">
      {/* Top bar */}
      <div className="border-b border-zinc-900 px-8 py-5">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {building && (
            <>
              <Link href={`/buildings/${building.id}`} className="hover:text-zinc-300 transition-colors">
                {building.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          {floor && (
            <>
              <Link
                href={`/buildings/${diag.buildingId}/floors/${floor.number}`}
                className="hover:text-zinc-300 transition-colors"
              >
                {floor.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-zinc-200">Diagnosis</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold capitalize">
                  {diag.hvacIssueType.replace(/_/g, " ")}
                </h1>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${sevStyle.cls}`}>
                  {sevStyle.label} severity
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">
                {building?.name} · {floor?.label} ·{" "}
                {new Date(diag.generatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PrintButton />
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl space-y-8">
        {/* Meta strip */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Confidence", value: `${Math.round(diag.confidenceScore * 100)}%` },
            { label: "Complaints analyzed", value: diag.complaintIds.length.toString() },
            { label: "Affected zones", value: diag.affectedZones.join(", ") || "—" },
            {
              label: "Actions",
              value: diag.recommendedActions.length.toString(),
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">{item.label}</p>
              <p className="text-lg font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main analysis */}
          <div className="col-span-2 space-y-6">
            {/* Root cause */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                Root cause
              </h2>
              <p className="text-zinc-200 leading-relaxed">{diag.rootCause}</p>
            </div>

            {/* Full analysis */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
                Full analysis
              </h2>
              <MarkdownContent content={diag.fullAnalysis} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Recommended actions */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">
                Recommended actions
              </h2>
              <ol className="space-y-3">
                {diag.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">{action}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Source complaints */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">
                Source complaints ({complaints.length})
              </h2>
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="border-l-2 border-zinc-700 pl-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-300">
                        Room {c.roomNumber}
                      </span>
                      <span className="text-xs text-zinc-600">sev {c.severity}/5</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.symptoms.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-zinc-800 px-1 py-0.5 text-xs text-zinc-500 capitalize"
                        >
                          {s.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n")
  return (
    <div className="space-y-3 text-sm">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-zinc-100 mt-4 first:mt-0">
              {line.replace("## ", "")}
            </h3>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h4 key={i} className="text-sm font-semibold text-zinc-200 mt-3">
              {line.replace("### ", "")}
            </h4>
          )
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-semibold text-zinc-200">
              {line.replace(/\*\*/g, "")}
            </p>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-zinc-600 mt-1 flex-shrink-0">•</span>
              <p className="text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong class='text-zinc-200'>$1</strong>") }} />
            </div>
          )
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return (
          <p key={i} className="text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-zinc-200'>$1</strong>") }} />
        )
      })}
    </div>
  )
}
