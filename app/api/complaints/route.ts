import { NextRequest, NextResponse } from "next/server"
import { SEED_COMPLAINTS } from "@/lib/mock-data"
import type { Complaint, ComplaintSymptom } from "@/lib/types"

// In-memory store for demo — replace with Supabase when configured
const complaints: Complaint[] = [...SEED_COMPLAINTS]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const floorId = searchParams.get("floor_id")
  const buildingId = searchParams.get("building_id")
  const roomId = searchParams.get("room_id")

  let result = complaints
  if (floorId) result = result.filter((c) => c.floorId === floorId)
  if (buildingId) result = result.filter((c) => c.buildingId === buildingId)
  if (roomId) result = result.filter((c) => c.roomId === roomId)

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const complaint: Complaint = {
    id: `cmp-${Date.now()}`,
    roomId: body.roomId,
    roomNumber: body.roomNumber,
    floorId: body.floorId,
    buildingId: body.buildingId,
    reportedBy: body.reportedBy ?? undefined,
    symptoms: (body.symptoms ?? []) as ComplaintSymptom[],
    description: body.description ?? "",
    severity: body.severity ?? 3,
    status: "open",
    createdAt: new Date().toISOString(),
  }

  complaints.push(complaint)
  return NextResponse.json(complaint, { status: 201 })
}
