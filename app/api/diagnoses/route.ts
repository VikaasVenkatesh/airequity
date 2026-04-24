import { NextRequest, NextResponse } from "next/server"
import { SEED_DIAGNOSES, SEED_COMPLAINTS, BUILDINGS } from "@/lib/mock-data"
import { generateDiagnosis } from "@/lib/claude/diagnose"
import type { Diagnosis } from "@/lib/types"

const diagnoses: Diagnosis[] = [...SEED_DIAGNOSES]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const floorId = searchParams.get("floor_id")
  const buildingId = searchParams.get("building_id")

  let result = diagnoses
  if (floorId) result = result.filter((d) => d.floorId === floorId)
  if (buildingId) result = result.filter((d) => d.buildingId === buildingId)

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { floorId, buildingId, complaintIds } = body as {
    floorId: string
    buildingId: string
    complaintIds?: string[]
  }

  const building = BUILDINGS.find((b) => b.id === buildingId)
  if (!building) return NextResponse.json({ error: "Building not found" }, { status: 404 })

  const floor = building.floors.find((f) => f.id === floorId)
  if (!floor) return NextResponse.json({ error: "Floor not found" }, { status: 404 })

  // Gather complaints — either explicit IDs or all open complaints for this floor
  const allComplaints = [...SEED_COMPLAINTS]
  const targetComplaints = complaintIds
    ? allComplaints.filter((c) => complaintIds.includes(c.id))
    : allComplaints.filter((c) => c.floorId === floorId && c.status === "open")

  if (targetComplaints.length === 0) {
    return NextResponse.json({ error: "No open complaints found for this floor" }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 })
  }

  const partial = await generateDiagnosis(targetComplaints, building, floor)

  const diagnosis: Diagnosis = {
    id: `diag-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    ...partial,
  }

  diagnoses.push(diagnosis)
  return NextResponse.json(diagnosis, { status: 201 })
}
