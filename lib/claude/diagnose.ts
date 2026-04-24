import Anthropic from "@anthropic-ai/sdk"
import type { Complaint, Building, Floor, Diagnosis, HvacIssueType } from "@/lib/types"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert building HVAC engineer and indoor air quality specialist with 20 years of experience diagnosing air quality problems in commercial and institutional buildings. You analyze patterns of occupant complaints alongside building HVAC system information to identify root causes and recommend actionable remediation steps.

Your diagnoses are:
- Evidence-based: you cite specific symptoms, their patterns, and what they indicate mechanistically
- Spatially aware: you consider where in the building complaints cluster and what that reveals about HVAC zones
- Actionable: you give prioritized, specific remediation steps (not vague recommendations)
- Honest about uncertainty: you state your confidence level and what would confirm or rule out your hypothesis

Output structured JSON matching the DiagnosisOutput type.`

interface DiagnosisOutput {
  rootCause: string
  hvacIssueType: HvacIssueType
  severityAssessment: "low" | "moderate" | "high" | "critical"
  recommendedActions: string[]
  affectedZones: string[]
  fullAnalysis: string
  confidenceScore: number
}

export async function generateDiagnosis(
  complaints: Complaint[],
  building: Building,
  floor: Floor
): Promise<Omit<Diagnosis, "id" | "generatedAt">> {
  const complaintSummary = complaints
    .map(
      (c) =>
        `- Room ${c.roomNumber}: ${c.symptoms.join(", ")} — "${c.description}" (severity: ${c.severity}/5)`
    )
    .join("\n")

  const affectedRoomNumbers = [...new Set(complaints.map((c) => c.roomNumber))]
  const affectedRooms = floor.rooms.filter((r) =>
    affectedRoomNumbers.includes(r.number)
  )
  const zones = [...new Set(affectedRooms.map((r) => r.hvacZone))]

  const prompt = `Analyze these air quality complaints from ${building.name}, ${floor.label}.

## Building Context
- Building: ${building.name} (${building.address})
- Total GSF: ${building.totalGsf.toLocaleString()} sq ft
- Floor: ${floor.label}
- HVAC System: Central air handling units (AHUs) with VAV distribution
- Zone layout: Zone A = North wing, Zone B = South wing (the building has a curved "boomerang" shape)
- Note: The curved geometry creates pressure balance challenges, especially at corridor bends

## Complaints (${complaints.length} total)
${complaintSummary}

## Affected Area
Rooms: ${affectedRoomNumbers.join(", ")}
HVAC Zones: ${zones.join(", ")}

## Your Task
Identify the most likely root cause, classify the HVAC issue type, assess severity, and provide specific remediation steps.

Respond with JSON matching this exact structure:
{
  "rootCause": "string — 1-2 sentences, specific and mechanistic",
  "hvacIssueType": "one of: co2_buildup | temperature_imbalance | humidity | contamination | duct_blockage | refrigerant_leak | exhaust_failure | thermal_bridging | condensation | unknown",
  "severityAssessment": "one of: low | moderate | high | critical",
  "recommendedActions": ["array of specific action strings, ordered by priority"],
  "affectedZones": ["array of zone names/codes"],
  "fullAnalysis": "string — comprehensive markdown analysis (400-600 words) including summary, root cause reasoning, building-specific factors, and remediation sequence",
  "confidenceScore": 0.0-1.0
}`

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""

  // Extract JSON from response (may be wrapped in ```json blocks)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)
  const jsonStr = jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : text
  const parsed = JSON.parse(jsonStr) as DiagnosisOutput

  return {
    buildingId: building.id,
    floorId: floor.id,
    complaintIds: complaints.map((c) => c.id),
    ...parsed,
  }
}
