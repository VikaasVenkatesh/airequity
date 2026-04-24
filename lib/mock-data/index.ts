import type { Building, Complaint, Diagnosis, Room, Floor } from "@/lib/types"

// ── Floor 4 rooms ─────────────────────────────────────────────────────────────
// SVG canvas: 1100 × 420
// Layout: Central corridor y=180–210 (horizontal band)
// Zone A (North wing, rooms 4200–4330): x=520–1080
// Zone B (South wing, rooms 4100–4164): x=20–500
// Rooms above corridor (y=70–170) = west side
// Rooms below corridor (y=220–330) = east side

function office(
  num: string,
  x: number,
  y: number,
  w = 52,
  h = 44,
  zone: "A" | "B" = "B"
): Room {
  return {
    id: `432_4_${num}`,
    number: num,
    type: "office",
    hvacZone: zone,
    floorId: "432_4",
    buildingId: "432",
    x,
    y,
    w,
    h,
  }
}

const floor4Rooms: Room[] = [
  // ── Large open area south end ─────────────────────────────────────────────
  { id: "432_4_4100", number: "4100", type: "open", hvacZone: "B", floorId: "432_4", buildingId: "432", x: 20, y: 70, w: 110, h: 260 },

  // ── South wing — west side (above corridor) ───────────────────────────────
  office("4105", 140, 70),
  office("4108", 196, 70, 65, 95),   // corner, exterior south
  office("4112", 265, 70),
  office("4116", 265, 118),
  office("4120", 321, 70),
  office("4121", 321, 118),
  office("4122", 377, 70),
  office("4123", 377, 118),
  office("4124", 433, 70),
  office("4125", 433, 118),

  // ── South wing — east side (below corridor) ───────────────────────────────
  office("4126", 140, 218),
  office("4128", 196, 218),
  office("4130", 252, 218),
  office("4132", 308, 218),
  office("4134", 364, 218),
  office("4136", 140, 266),
  office("4137", 196, 266),
  office("4138", 252, 266),
  office("4140", 308, 266),
  office("4141", 364, 266),
  office("4142", 140, 314),
  office("4143", 196, 314),
  office("4144", 252, 314),
  office("4146", 308, 314),
  office("4148", 364, 314),

  // ── Stairwell / core ──────────────────────────────────────────────────────
  { id: "432_4_4135", number: "4135", name: "Stair SW", type: "stairwell", hvacZone: "B", floorId: "432_4", buildingId: "432", x: 433, y: 155, w: 52, h: 45 },
  { id: "432_4_4150", number: "4150", name: "Elevator / Lobby", type: "elevator", hvacZone: "B", floorId: "432_4", buildingId: "432", x: 433, y: 204, w: 52, h: 100 },

  // ── North wing — west side (above corridor) ───────────────────────────────
  office("4152", 495, 70, 52, 44, "A"),
  office("4154", 495, 118, 52, 44, "A"),
  office("4200", 551, 70, 52, 44, "A"),
  office("4202", 607, 70, 52, 44, "A"),
  office("4204", 663, 70, 52, 44, "A"),
  office("4206", 719, 70, 52, 44, "A"),
  office("4207", 775, 70, 52, 44, "A"),
  office("4208", 831, 70, 52, 44, "A"),
  office("4210", 887, 70, 52, 44, "A"),
  office("4212", 943, 70, 52, 44, "A"),
  office("4213", 551, 118, 52, 44, "A"),
  office("4214", 607, 118, 52, 44, "A"),
  office("4215", 663, 118, 52, 44, "A"),
  office("4216", 719, 118, 52, 44, "A"),
  office("4218", 775, 118, 52, 44, "A"),
  office("4219", 831, 118, 52, 44, "A"),

  // ── North wing — east side (below corridor) ───────────────────────────────
  office("4220", 495, 218, 52, 44, "A"),
  office("4221", 551, 218, 52, 44, "A"),
  office("4222", 607, 218, 52, 44, "A"),
  office("4223", 663, 218, 52, 44, "A"),
  office("4224", 719, 218, 52, 44, "A"),
  office("4225", 775, 218, 52, 44, "A"),
  office("4226", 831, 218, 52, 44, "A"),
  office("4228", 887, 218, 52, 44, "A"),
  office("4229", 943, 218, 52, 44, "A"),
  office("4230", 495, 266, 52, 44, "A"),
  office("4231", 551, 266, 52, 44, "A"),
  office("4232", 607, 266, 52, 44, "A"),
  office("4233", 663, 266, 52, 44, "A"),
  office("4234", 719, 266, 52, 44, "A"),
  office("4237", 775, 266, 52, 44, "A"),
  office("4238", 831, 266, 52, 44, "A"),
  office("4239", 887, 266, 52, 44, "A"),
  office("4240", 943, 266, 52, 44, "A"),
  office("4241", 495, 314, 52, 44, "A"),
  office("4242", 551, 314, 52, 44, "A"),
  office("4244", 607, 314, 52, 44, "A"),
  office("4246", 663, 314, 52, 44, "A"),
  office("4248", 719, 314, 52, 44, "A"),
  office("4249", 775, 314, 52, 44, "A"),
  office("4250", 831, 314, 52, 44, "A"),

  // ── Far north extension (4300s) ───────────────────────────────────────────
  office("4300", 999, 70, 52, 44, "A"),
  office("4302", 999, 118, 52, 44, "A"),
  office("4304", 999, 166, 52, 44, "A"),
  office("4306", 999, 218, 52, 44, "A"),
  office("4308", 999, 266, 52, 44, "A"),
  office("4310", 999, 314, 52, 44, "A"),
  office("4312", 1055, 70, 52, 44, "A"),
  office("4314", 1055, 118, 52, 44, "A"),
  office("4316", 1055, 166, 52, 44, "A"),
  office("4318", 1055, 218, 52, 44, "A"),
  office("4320", 1055, 266, 52, 44, "A"),
  office("4322", 1055, 314, 52, 44, "A"),
  { id: "432_4_4330", number: "4330", name: "NW Corner", type: "office", hvacZone: "A", floorId: "432_4", buildingId: "432", x: 943, y: 314, w: 52, h: 44 },
]

// ── Floor 5 (similar layout, slightly different rooms) ─────────────────────
const floor5Rooms: Room[] = floor4Rooms.map((r) => ({
  ...r,
  id: r.id.replace("432_4_", "432_5_").replace("_4", "_5"),
  number: r.number.replace(/^4/, "5"),
  floorId: "432_5",
}))

const floors: Floor[] = [
  {
    id: "432_4",
    buildingId: "432",
    number: "4",
    label: "Floor 4",
    rooms: floor4Rooms,
    svgWidth: 1120,
    svgHeight: 420,
  },
  {
    id: "432_5",
    buildingId: "432",
    number: "5",
    label: "Floor 5",
    rooms: floor5Rooms,
    svgWidth: 1120,
    svgHeight: 420,
  },
  {
    id: "432_2",
    buildingId: "432",
    number: "2",
    label: "Floor 2",
    rooms: [],
    svgWidth: 1120,
    svgHeight: 420,
  },
  {
    id: "432_1",
    buildingId: "432",
    number: "1",
    label: "Floor 1",
    rooms: [],
    svgWidth: 1120,
    svgHeight: 420,
  },
  {
    id: "432_0",
    buildingId: "432",
    number: "0",
    label: "Ground Floor",
    rooms: [],
    svgWidth: 1120,
    svgHeight: 420,
  },
]

export const IRIBE_CENTER: Building = {
  id: "432",
  name: "Brendan Iribe Center",
  address: "8125 Paint Branch Dr, College Park, MD 20742",
  totalGsf: 215600,
  openedYear: 2019,
  architect: "HDR / Brian Kowalchuk",
  floors,
}

export const BUILDINGS: Building[] = [IRIBE_CENTER]

// ── Seed complaints ────────────────────────────────────────────────────────
export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: "cmp-001",
    roomId: "432_4_4220",
    roomNumber: "4220",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "Dr. A. Ramirez",
    symptoms: ["headache", "fatigue", "stuffy"],
    description:
      "Persistent headaches in the afternoon. Room feels stale and stuffy despite AC running. Multiple colleagues have complained this week.",
    severity: 4,
    status: "open",
    createdAt: "2026-04-20T14:30:00Z",
  },
  {
    id: "cmp-002",
    roomId: "432_4_4222",
    roomNumber: "4222",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "Prof. T. Singh",
    symptoms: ["stuffy", "fatigue"],
    description: "Air feels recycled. No fresh air sensation. CO2 monitor on my desk is showing 1400 ppm.",
    severity: 4,
    status: "open",
    createdAt: "2026-04-21T09:15:00Z",
  },
  {
    id: "cmp-003",
    roomId: "432_4_4224",
    roomNumber: "4224",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "Anonymous",
    symptoms: ["headache", "stuffy"],
    description: "Very stuffy in the mornings. Gets worse when more people are in the building.",
    severity: 3,
    status: "open",
    createdAt: "2026-04-22T10:00:00Z",
  },
  {
    id: "cmp-004",
    roomId: "432_4_4108",
    roomNumber: "4108",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "C. Williams",
    symptoms: ["drafts", "cold", "condensation"],
    description:
      "Freezing drafts near the window in winter. Condensation forming on the glass. Temperature swings 10°F throughout the day.",
    severity: 3,
    status: "diagnosed",
    createdAt: "2026-04-18T08:45:00Z",
  },
  {
    id: "cmp-005",
    roomId: "432_4_4226",
    roomNumber: "4226",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "B. Chen",
    symptoms: ["headache", "fatigue", "eye_irritation"],
    description: "Eye irritation and headaches, especially after 2pm. Room is always warm.",
    severity: 3,
    status: "open",
    createdAt: "2026-04-22T14:00:00Z",
  },
  {
    id: "cmp-006",
    roomId: "432_4_4230",
    roomNumber: "4230",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "Dr. K. Patel",
    symptoms: ["stuffy", "fatigue"],
    description: "Stuffy air. Hard to concentrate in afternoon meetings.",
    severity: 2,
    status: "open",
    createdAt: "2026-04-23T11:30:00Z",
  },
  {
    id: "cmp-007",
    roomId: "432_4_4316",
    roomNumber: "4316",
    floorId: "432_4",
    buildingId: "432",
    reportedBy: "R. Johnson",
    symptoms: ["overheating"],
    description: "Room is consistently 5-7 degrees warmer than rest of the floor. Thermostat doesn't seem to work.",
    severity: 3,
    status: "open",
    createdAt: "2026-04-19T16:00:00Z",
  },
]

// ── Seed diagnoses ─────────────────────────────────────────────────────────
export const SEED_DIAGNOSES: Diagnosis[] = [
  {
    id: "diag-001",
    buildingId: "432",
    floorId: "432_4",
    complaintIds: ["cmp-001", "cmp-002", "cmp-003", "cmp-005", "cmp-006"],
    rootCause:
      "Zone B transition point at corridor bend (rooms 4219–4230) has insufficient fresh air exchange. The VAV box serving this sub-zone is operating at minimum ventilation position and not modulating correctly under occupancy load.",
    hvacIssueType: "co2_buildup",
    severityAssessment: "high",
    recommendedActions: [
      "Inspect and recalibrate VAV box damper at AHU-B Zone B-2 serving rooms 4219–4230",
      "Verify CO₂ sensor in return air plenum for Zone B-2 is functional and calibrated",
      "Increase minimum ventilation setpoint from 15% to 25% for Zone B-2 during occupied hours",
      "Schedule filter inspection for AHU-B — pressure drop may be limiting fresh air flow",
      "Install portable CO₂ monitors in rooms 4220, 4222, 4224 to track remediation progress",
    ],
    affectedZones: ["B-2", "B-3"],
    fullAnalysis: `## AI Diagnosis — Floor 4 North Wing CO₂ Cluster

**Analysis Date:** April 23, 2026
**Confidence:** 87%

### Summary
Five complaints in a tight geographic cluster (rooms 4220–4230) all report headaches, fatigue, and stuffiness — the classic triad of CO₂ buildup. One occupant independently measured 1,400 ppm, which is above ASHRAE 62.1's 1,100 ppm threshold.

### Root Cause Assessment
The cluster pattern strongly suggests a sub-zone HVAC failure rather than a global building issue. The affected rooms all sit at the corridor bend in the north wing — the Zone B/A transition area. This is architecturally significant: the building's curved geometry creates a "dead zone" in ductwork pressure at this bend, where static pressure drops and VAV boxes tend to under-ventilate under high occupancy.

Contributing factors:
- **VAV box malfunction**: The VAV box serving the 4219–4230 sub-zone is likely stuck at minimum position or has a faulty actuator. This is the most probable root cause.
- **CO₂ sensor drift**: If the zone's CO₂ demand-control ventilation sensor has drifted, the control system believes the space is adequately ventilated when it is not.
- **Filter loading**: AHU-B may be operating with a high-resistance filter, reducing fresh air capacity for the entire north wing.

### What Makes This Corridor Bend Vulnerable
The boomerang shape of the Iribe Center creates longer duct runs to the northern terminus. At the 4219–4230 area, the duct transitions between two duct branches. This is a known pressure balance challenge in this building type. Without proper balancing, one branch preferentially receives fresh air while the other starves.

### Recommended Remediation Sequence
1. **Immediate (this week)**: Manually override VAV Box B-2-7 to 40% open position to provide emergency ventilation relief.
2. **Short-term (1–2 weeks)**: Full inspection of VAV actuator and CO₂ sensor for Zone B-2.
3. **Medium-term (1 month)**: Rebalance the duct branches serving 4200–4260 corridor per ASHRAE 62.1 requirements.
4. **Monitoring**: Deploy portable sensors in the affected rooms to verify CO₂ returns below 900 ppm after remediation.`,
    confidenceScore: 0.87,
    generatedAt: "2026-04-23T16:45:00Z",
  },
]
