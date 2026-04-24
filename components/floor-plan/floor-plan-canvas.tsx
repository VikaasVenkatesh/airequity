"use client"

import { useRouter } from "next/navigation"
import type { Floor, Complaint, Room } from "@/lib/types"

interface FloorPlanCanvasProps {
  floor: Floor
  complaints: Complaint[]
  selectedRoom?: string
  buildingId: string
  floorNum: string
}

function getRoomStatus(room: Room, complaints: Complaint[]) {
  const roomComplaints = complaints.filter((c) => c.roomNumber === room.number)
  if (roomComplaints.length === 0) return "none"
  const maxSev = Math.max(...roomComplaints.map((c) => c.severity))
  if (maxSev >= 4) return "critical"
  if (maxSev >= 3) return "warning"
  return "mild"
}

const STATUS_COLORS = {
  none: { fill: "#18181b", stroke: "#27272a", text: "#71717a" },
  mild: { fill: "#14532d22", stroke: "#166534", text: "#4ade80" },
  warning: { fill: "#78350f22", stroke: "#92400e", text: "#fbbf24" },
  critical: { fill: "#7f1d1d33", stroke: "#991b1b", text: "#f87171" },
  selected: { fill: "#1e3a5f", stroke: "#3b82f6", text: "#93c5fd" },
  stairwell: { fill: "#27272a", stroke: "#3f3f46", text: "#52525b" },
  elevator: { fill: "#1c1917", stroke: "#44403c", text: "#78716c" },
  open: { fill: "#0f172a", stroke: "#1e3a5f", text: "#475569" },
}

export function FloorPlanCanvas({
  floor,
  complaints,
  selectedRoom,
  buildingId,
  floorNum,
}: FloorPlanCanvasProps) {
  const router = useRouter()

  if (floor.rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 rounded-xl border border-zinc-900 border-dashed">
        <p className="text-sm text-zinc-600">Floor plan not yet available for this floor.</p>
      </div>
    )
  }

  const handleRoomClick = (roomNumber: string) => {
    const current = new URL(window.location.href)
    if (current.searchParams.get("room") === roomNumber) {
      router.push(`/buildings/${buildingId}/floors/${floorNum}?tab=map`)
    } else {
      router.push(`/buildings/${buildingId}/floors/${floorNum}?tab=map&room=${roomNumber}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-zinc-500">
        <span className="font-medium text-zinc-400">Air quality:</span>
        {[
          { label: "No complaints", color: "#27272a" },
          { label: "Mild (1–2)", color: "#166534" },
          { label: "Warning (3)", color: "#92400e" },
          { label: "Critical (4–5)", color: "#991b1b" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-sm border"
              style={{ background: color + "33", borderColor: color }}
            />
            {label}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-3 text-zinc-600">
          <span className="rounded px-1.5 py-0.5 bg-zinc-900 border border-blue-900 text-blue-400">A</span>
          Zone A (North)
          <span className="rounded px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-400">B</span>
          Zone B (South)
        </div>
      </div>

      {/* SVG Floor Plan */}
      <div className="overflow-auto rounded-xl border border-zinc-900 bg-zinc-950/60">
        <svg
          viewBox={`0 0 ${floor.svgWidth} ${floor.svgHeight}`}
          width="100%"
          style={{ minWidth: 700 }}
          className="block"
        >
          {/* Building outline background */}
          <rect
            x="10"
            y="50"
            width={floor.svgWidth - 20}
            height="340"
            rx="4"
            fill="#09090b"
            stroke="#27272a"
            strokeWidth="1"
          />

          {/* Corridor band */}
          <rect
            x="130"
            y="188"
            width={floor.svgWidth - 145}
            height="44"
            fill="#111827"
            stroke="#1f2937"
            strokeWidth="0.5"
          />
          <text x="135" y="214" fontSize="8" fill="#374151" fontFamily="monospace">
            CORRIDOR
          </text>

          {/* Zone divider label */}
          <line x1="485" y1="55" x2="485" y2="385" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4" />
          <text x="250" y="67" fontSize="9" fill="#3f3f46" fontFamily="monospace" textAnchor="middle">
            ZONE B — SOUTH WING
          </text>
          <text x="750" y="67" fontSize="9" fill="#1e3a5f" fontFamily="monospace" textAnchor="middle">
            ZONE A — NORTH WING
          </text>

          {/* Rooms */}
          {floor.rooms.map((room) => {
            const isSelected = selectedRoom === room.number
            const status = isSelected
              ? "selected"
              : room.type === "stairwell"
                ? "stairwell"
                : room.type === "elevator"
                  ? "elevator"
                  : room.type === "open"
                    ? "open"
                    : getRoomStatus(room, complaints)

            const colors = STATUS_COLORS[status]
            const count = complaints.filter((c) => c.roomNumber === room.number).length
            const isClickable = room.type === "office" || room.type === "open"

            return (
              <g
                key={room.id}
                onClick={() => isClickable && handleRoomClick(room.number)}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  rx="2"
                  fill={colors.fill}
                  stroke={isSelected ? "#3b82f6" : colors.stroke}
                  strokeWidth={isSelected ? 1.5 : 0.75}
                />
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 - (count > 0 ? 5 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={room.w > 80 ? 9 : 7}
                  fontFamily="monospace"
                  fill={colors.text}
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {room.name ?? room.number}
                </text>
                {count > 0 && (
                  <>
                    <circle
                      cx={room.x + room.w - 6}
                      cy={room.y + 6}
                      r="6"
                      fill={status === "critical" ? "#dc2626" : "#d97706"}
                    />
                    <text
                      x={room.x + room.w - 6}
                      y={room.y + 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="6"
                      fontFamily="monospace"
                      fill="white"
                      fontWeight="bold"
                    >
                      {count}
                    </text>
                  </>
                )}
              </g>
            )
          })}

          {/* Floor label */}
          <text x={floor.svgWidth / 2} y="395" textAnchor="middle" fontSize="10" fill="#3f3f46" fontFamily="sans-serif">
            {floor.label} — Brendan Iribe Center (Building 432)
          </text>
        </svg>
      </div>

      <p className="text-xs text-zinc-700 text-center">
        Click any room to view complaints · Numbers in circles = open complaints
      </p>
    </div>
  )
}
