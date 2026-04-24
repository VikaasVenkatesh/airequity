import { NextRequest, NextResponse } from "next/server"
import { SEED_DIAGNOSES } from "@/lib/mock-data"
import type { Diagnosis } from "@/lib/types"

const diagnoses: Diagnosis[] = [...SEED_DIAGNOSES]

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const diagnosis = diagnoses.find((d) => d.id === id)
  if (!diagnosis) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(diagnosis)
}
