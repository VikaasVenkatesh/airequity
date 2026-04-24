"use client"

import dynamic from "next/dynamic"
import type { Floor, Complaint } from "@/lib/types"

const FloorPlan3D = dynamic(
  () => import("./floor-plan-3d").then((m) => m.FloorPlan3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center rounded-xl border border-white/10 bg-[#030712]" style={{ height: 480 }}>
        <div className="text-center space-y-2">
          <div className="h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-600">Loading 3D view…</p>
        </div>
      </div>
    ),
  }
)

export function FloorPlan3DLoader({
  floor,
  complaints,
  selectedRoom,
  onSelectRoom,
}: {
  floor: Floor
  complaints: Complaint[]
  selectedRoom?: string
  onSelectRoom?: (n: string | undefined) => void
}) {
  return (
    <FloorPlan3D
      floor={floor}
      complaints={complaints}
      selectedRoom={selectedRoom}
      onSelectRoom={onSelectRoom}
    />
  )
}
