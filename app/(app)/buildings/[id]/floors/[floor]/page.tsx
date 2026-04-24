import { notFound } from "next/navigation"
import Link from "next/link"
import { BUILDINGS, SEED_COMPLAINTS, SEED_DIAGNOSES } from "@/lib/mock-data"
import { FloorPlanCanvas } from "@/components/floor-plan/floor-plan-canvas"
import { FloorPlan3DLoader } from "@/components/floor-plan/floor-plan-3d-loader"
import { AuroraBg } from "@/components/shell/aurora-bg"
import { ChevronRight, AlertTriangle, Brain, Share2, Box } from "lucide-react"

export default async function FloorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; floor: string }>
  searchParams: Promise<{ room?: string; tab?: string }>
}) {
  const { id, floor: floorNum } = await params
  const { room: selectedRoom, tab = "3d" } = await searchParams

  const building = BUILDINGS.find((b) => b.id === id)
  if (!building) notFound()

  const floor = building.floors.find((f) => f.number === floorNum)
  if (!floor) notFound()

  const floorComplaints = SEED_COMPLAINTS.filter((c) => c.floorId === floor.id)
  const openComplaints  = floorComplaints.filter((c) => c.status === "open")
  const floorDiagnoses  = SEED_DIAGNOSES.filter((d) => d.floorId === floor.id)
  const roomComplaints  = selectedRoom ? floorComplaints.filter((c) => c.roomNumber === selectedRoom) : []

  const tabs = [
    { key: "3d",    label: "3D View",    icon: Box },
    { key: "map",   label: "Floor map",  icon: Share2 },
    { key: "graph", label: "HVAC graph", icon: Brain },
  ]

  return (
    <div className="relative min-h-full flex flex-col">
      <AuroraBg />
      <div className="relative z-10 flex flex-col flex-1">

        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/buildings/${id}`} className="hover:text-zinc-300 transition-colors">{building.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-200">{floor.label}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <h1 className="text-lg font-bold tracking-tight">
                <span className="gradient-text-cyan">{floor.label}</span>
              </h1>
              <div className="flex items-center gap-1.5 text-sm">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-amber-300">{openComplaints.length} open complaints</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4">
            {tabs.map(({ key, label, icon: Icon }) => (
              <Link
                key={key}
                href={`/buildings/${id}/floors/${floorNum}?tab=${key}${selectedRoom ? `&room=${selectedRoom}` : ""}`}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                  tab === key
                    ? "bg-white/[0.08] text-white border border-white/10"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {tab === "3d" ? (
            <>
              <div className="flex-1 overflow-auto p-6 space-y-4">
                {/* Legend */}
                <div className="flex items-center gap-5 text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">Height = severity · Color = air quality</span>
                  {[
                    { label: "No complaints", color: "#1e293b" },
                    { label: "Mild",          color: "#064e3b" },
                    { label: "Moderate",      color: "#78350f" },
                    { label: "Critical",      color: "#7f1d1d" },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-sm" style={{ background: color }} />
                      {label}
                    </div>
                  ))}
                  <span className="text-zinc-700 ml-auto">Drag to orbit · Scroll to zoom · Click room to select</span>
                </div>
                <FloorPlan3DLoader
                  floor={floor}
                  complaints={floorComplaints}
                  selectedRoom={selectedRoom}
                />
              </div>
              <div className="w-72 border-l border-white/[0.06] flex flex-col">
                {selectedRoom
                  ? <RoomPanel roomNumber={selectedRoom} complaints={roomComplaints} buildingId={id} floorNum={floorNum} />
                  : <FloorSummaryPanel floorComplaints={floorComplaints} diagnoses={floorDiagnoses} />
                }
              </div>
            </>
          ) : tab === "map" ? (
            <>
              <div className="flex-1 overflow-auto p-6">
                <FloorPlanCanvas floor={floor} complaints={floorComplaints} selectedRoom={selectedRoom} buildingId={id} floorNum={floorNum} />
              </div>
              <div className="w-72 border-l border-white/[0.06] flex flex-col">
                {selectedRoom
                  ? <RoomPanel roomNumber={selectedRoom} complaints={roomComplaints} buildingId={id} floorNum={floorNum} />
                  : <FloorSummaryPanel floorComplaints={floorComplaints} diagnoses={floorDiagnoses} />
                }
              </div>
            </>
          ) : (
            <div className="flex-1">
              {/* Lazy import HvacGraph to avoid SSR issues */}
              <HvacGraphWrapper floor={floor} complaints={floorComplaints} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { HvacGraph } from "@/components/knowledge-graph/hvac-graph"
import type { Floor, Complaint } from "@/lib/types"

function HvacGraphWrapper({ floor, complaints }: { floor: Floor; complaints: Complaint[] }) {
  return <HvacGraph floor={floor} complaints={complaints} />
}

// ── Side panels ───────────────────────────────────────────────────────────
function RoomPanel({ roomNumber, complaints, buildingId, floorNum }: {
  roomNumber: string
  complaints: typeof SEED_COMPLAINTS
  buildingId: string
  floorNum: string
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-zinc-100">Room {roomNumber}</h3>
          <Link href={`/buildings/${buildingId}/floors/${floorNum}`} className="text-xs text-zinc-600 hover:text-zinc-400">Clear</Link>
        </div>
        <p className="text-xs text-zinc-500">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex-1 overflow-auto p-5 space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-zinc-600">No complaints for this room</p>
            <Link href={`/complaints/new?room=${roomNumber}&building=${buildingId}&floor=${floorNum}`} className="inline-block mt-3 text-xs text-zinc-400 hover:text-white transition-colors border border-white/10 rounded-lg px-3 py-2">
              + Submit complaint
            </Link>
          </div>
        ) : complaints.map((c) => (
          <div key={c.id} className="rounded-lg glass border border-white/[0.06] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <StatusPill status={c.status} />
              <span className="text-xs text-zinc-500">{c.severity}/5</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {c.symptoms.map((s) => (
                <span key={s} className="rounded-md bg-white/5 border border-white/8 px-1.5 py-0.5 text-xs text-zinc-400 capitalize">{s.replace("_", " ")}</span>
              ))}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.description}</p>
            {c.reportedBy && <p className="text-xs text-zinc-600">— {c.reportedBy}</p>}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/[0.06]">
        <Link href={`/complaints/new?room=${roomNumber}&building=${buildingId}&floor=${floorNum}`} className="btn-press flex items-center justify-center w-full rounded-lg border border-white/10 glass hover:bg-white/[0.06] transition-colors px-4 py-2.5 text-sm font-medium text-zinc-300">
          + File complaint
        </Link>
      </div>
    </div>
  )
}

function FloorSummaryPanel({ floorComplaints, diagnoses }: { floorComplaints: typeof SEED_COMPLAINTS; diagnoses: typeof SEED_DIAGNOSES }) {
  const byRoom = floorComplaints.reduce<Record<string, typeof SEED_COMPLAINTS>>((acc, c) => {
    acc[c.roomNumber] = acc[c.roomNumber] ?? []
    acc[c.roomNumber].push(c)
    return acc
  }, {})
  const hotspots = Object.entries(byRoom)
    .map(([room, cs]) => ({ room, count: cs.length, maxSev: Math.max(...cs.map((c) => c.severity)) }))
    .sort((a, b) => b.maxSev - a.maxSev || b.count - a.count)
    .slice(0, 8)

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/[0.06]">
        <h3 className="font-semibold text-zinc-100">Floor overview</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Click a room to see details</p>
      </div>
      <div className="flex-1 overflow-auto p-5 space-y-6">
        {diagnoses.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Latest diagnosis</p>
            {diagnoses.slice(0, 1).map((d) => (
              <Link key={d.id} href={`/diagnoses/${d.id}`} className="card-hover block rounded-lg border border-violet-800/30 bg-violet-950/20 p-3 hover:bg-violet-950/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs font-medium text-violet-300 capitalize">{d.hvacIssueType.replace(/_/g, " ")}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{d.rootCause}</p>
                <p className="text-xs text-zinc-600 mt-1.5">View full diagnosis →</p>
              </Link>
            ))}
          </div>
        )}
        {hotspots.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Complaint hotspots</p>
            <div className="space-y-2">
              {hotspots.map(({ room, count, maxSev }) => (
                <div key={room} className="flex items-center justify-between py-1">
                  <span className="text-sm font-mono text-zinc-300">Room {room}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">{count}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((i) => (
                        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= maxSev ? maxSev >= 4 ? "bg-red-500" : maxSev >= 3 ? "bg-amber-500" : "bg-emerald-500" : "bg-zinc-800"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map = {
    open:      "bg-amber-950/60 text-amber-400 border-amber-800/50",
    diagnosed: "bg-violet-950/60 text-violet-400 border-violet-800/50",
    resolved:  "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
  }
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${map[status as keyof typeof map] ?? ""}`}>{status}</span>
}
