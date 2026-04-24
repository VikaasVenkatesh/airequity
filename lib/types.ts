export type AirQualityStatus = "good" | "warning" | "alert" | "critical" | "unknown"

export type RoomType =
  | "office"
  | "lab"
  | "corridor"
  | "stairwell"
  | "elevator"
  | "mechanical"
  | "restroom"
  | "open"
  | "auditorium"

export type HvacZone = "A" | "B" | "C" | "mechanical"

export interface Room {
  id: string
  number: string
  name?: string
  type: RoomType
  hvacZone: HvacZone
  floorId: string
  buildingId: string
  areaSqft?: number
  // SVG layout coords (normalized 0-1000 space)
  x: number
  y: number
  w: number
  h: number
}

export interface Floor {
  id: string
  buildingId: string
  number: string // "B0", "0", "M0", "1", "2", "4", "5", "6"
  label: string  // "Basement", "Ground", "Mezzanine", "Floor 1", etc.
  rooms: Room[]
  svgWidth: number
  svgHeight: number
}

export interface Building {
  id: string
  name: string
  address: string
  totalGsf: number
  floors: Floor[]
  openedYear?: number
  architect?: string
}

export type ComplaintSymptom =
  | "headache"
  | "fatigue"
  | "stuffy"
  | "drafts"
  | "overheating"
  | "cold"
  | "odor"
  | "eye_irritation"
  | "condensation"
  | "noise"
  | "other"

export interface Complaint {
  id: string
  roomId: string
  roomNumber: string
  floorId: string
  buildingId: string
  reportedBy?: string
  symptoms: ComplaintSymptom[]
  description: string
  severity: 1 | 2 | 3 | 4 | 5
  status: "open" | "diagnosed" | "resolved"
  createdAt: string
}

export type HvacIssueType =
  | "co2_buildup"
  | "temperature_imbalance"
  | "humidity"
  | "contamination"
  | "duct_blockage"
  | "refrigerant_leak"
  | "exhaust_failure"
  | "thermal_bridging"
  | "condensation"
  | "unknown"

export interface Diagnosis {
  id: string
  buildingId: string
  floorId: string
  complaintIds: string[]
  rootCause: string
  hvacIssueType: HvacIssueType
  severityAssessment: "low" | "moderate" | "high" | "critical"
  recommendedActions: string[]
  affectedZones: string[]
  fullAnalysis: string
  confidenceScore: number
  generatedAt: string
}

export interface HvacNode {
  id: string
  label: string
  type: "ahu" | "zone" | "room_cluster" | "room"
  zone?: HvacZone
  roomIds?: string[]
  metadata?: Record<string, string | number>
}

export interface HvacEdge {
  id: string
  source: string
  target: string
  label?: string
  flowRate?: number // CFM
  tempDelta?: number // degrees F above/below design
}
