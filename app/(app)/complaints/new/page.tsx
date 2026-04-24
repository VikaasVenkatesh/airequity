import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ComplaintForm } from "@/components/complaints/complaint-form"
import { BUILDINGS } from "@/lib/mock-data"

export default async function NewComplaintPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string; building?: string; floor?: string }>
}) {
  const { room, building: buildingId = "432", floor: floorNum = "4" } = await searchParams

  const building = BUILDINGS.find((b) => b.id === buildingId)
  const floor = building?.floors.find((f) => f.number === floorNum)

  const rooms = floor?.rooms.map((r) => ({ id: r.id, number: r.number, name: r.name })) ?? []

  return (
    <div className="min-h-full bg-zinc-950">
      <div className="border-b border-zinc-900 px-8 py-5">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {building && (
            <>
              <Link
                href={`/buildings/${building.id}/floors/${floorNum}`}
                className="hover:text-zinc-300 transition-colors"
              >
                {building.name} · {floor?.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-zinc-200">File complaint</span>
        </div>
        <h1 className="text-xl font-semibold">File an air quality complaint</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Report indoor air quality issues for investigation and diagnosis.
        </p>
      </div>

      <div className="px-8 py-8 max-w-2xl">
        <ComplaintForm
          rooms={rooms}
          defaultRoom={room}
          buildingId={buildingId}
          floorId={floor?.id ?? "432_4"}
          returnUrl={`/buildings/${buildingId}/floors/${floorNum}`}
        />
      </div>
    </div>
  )
}
