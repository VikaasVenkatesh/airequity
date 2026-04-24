"use client"

import { useCallback } from "react"
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { Floor, Complaint } from "@/lib/types"

interface HvacGraphProps {
  floor: Floor
  complaints: Complaint[]
}

function buildGraph(floor: Floor, complaints: Complaint[]) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const complaintsByRoom: Record<string, number> = {}
  complaints.forEach((c) => {
    complaintsByRoom[c.roomNumber] = (complaintsByRoom[c.roomNumber] ?? 0) + c.severity
  })

  // AHU nodes
  nodes.push(
    {
      id: "ahu-a",
      position: { x: 400, y: 20 },
      data: { label: "AHU-A\nNorth Wing" },
      style: {
        background: "#1e3a5f",
        border: "1px solid #3b82f6",
        borderRadius: "8px",
        color: "#93c5fd",
        padding: "10px 16px",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "monospace",
        whiteSpace: "pre",
        textAlign: "center",
      },
    },
    {
      id: "ahu-b",
      position: { x: 100, y: 20 },
      data: { label: "AHU-B\nSouth Wing" },
      style: {
        background: "#1c1917",
        border: "1px solid #57534e",
        borderRadius: "8px",
        color: "#a8a29e",
        padding: "10px 16px",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "monospace",
        whiteSpace: "pre",
        textAlign: "center",
      },
    }
  )

  // Zone nodes
  const zoneConfig = [
    { id: "zone-a1", ahuId: "ahu-a", label: "Zone A-1\n4152–4219", x: 250, y: 130, rooms: ["4152", "4154", "4200", "4202", "4204", "4206", "4207", "4208", "4210", "4212", "4213", "4214", "4215", "4216", "4218", "4219"] },
    { id: "zone-a2", ahuId: "ahu-a", label: "Zone A-2\n4220–4260", x: 450, y: 130, rooms: ["4220", "4221", "4222", "4223", "4224", "4225", "4226", "4228", "4229", "4230", "4231", "4232", "4233", "4234", "4237", "4238", "4239", "4240", "4241", "4242", "4244", "4246", "4248", "4249", "4250"] },
    { id: "zone-a3", ahuId: "ahu-a", label: "Zone A-3\n4300–4330", x: 650, y: 130, rooms: ["4300", "4302", "4304", "4306", "4308", "4310", "4312", "4314", "4316", "4318", "4320", "4322", "4330"] },
    { id: "zone-b1", ahuId: "ahu-b", label: "Zone B-1\n4100–4134", x: 30, y: 130, rooms: ["4100", "4105", "4108", "4112", "4116", "4120", "4121", "4122", "4123", "4124", "4125", "4126", "4128", "4130", "4132", "4134"] },
    { id: "zone-b2", ahuId: "ahu-b", label: "Zone B-2\n4136–4164", x: 130, y: 130, rooms: ["4136", "4137", "4138", "4140", "4141", "4142", "4143", "4144", "4146", "4148", "4152", "4154", "4160", "4162", "4164"] },
  ]

  zoneConfig.forEach((zone) => {
    const totalComplaintLoad = zone.rooms.reduce((sum, r) => sum + (complaintsByRoom[r] ?? 0), 0)
    const hasProblem = totalComplaintLoad > 3

    nodes.push({
      id: zone.id,
      position: { x: zone.x, y: zone.y },
      data: { label: zone.label + (hasProblem ? "\n⚠ Issue detected" : "") },
      style: {
        background: hasProblem ? "#451a03" : "#1c1917",
        border: `1px solid ${hasProblem ? "#c2410c" : "#3f3f46"}`,
        borderRadius: "6px",
        color: hasProblem ? "#fb923c" : "#a8a29e",
        padding: "8px 12px",
        fontSize: "10px",
        fontFamily: "monospace",
        whiteSpace: "pre",
        textAlign: "center",
        minWidth: "90px",
      },
    })

    edges.push({
      id: `${zone.ahuId}-${zone.id}`,
      source: zone.ahuId,
      target: zone.id,
      animated: hasProblem,
      style: {
        stroke: hasProblem ? "#f97316" : "#3f3f46",
        strokeWidth: hasProblem ? 2 : 1,
      },
      label: hasProblem ? "⚠ Low flow" : undefined,
      labelStyle: { fill: "#f97316", fontSize: 9 },
    })

    // Room nodes (just the ones with complaints)
    const problemRooms = zone.rooms.filter((r) => (complaintsByRoom[r] ?? 0) > 0)
    problemRooms.forEach((roomNum, idx) => {
      const load = complaintsByRoom[roomNum] ?? 0
      const nodeId = `room-${zone.id}-${roomNum}`
      const colOffset = (idx % 4) * 85
      const rowOffset = Math.floor(idx / 4) * 70

      nodes.push({
        id: nodeId,
        position: { x: zone.x + colOffset - 30, y: 240 + rowOffset },
        data: { label: `Rm ${roomNum}\n${load >= 5 ? "🔴" : "🟡"} sev ${load}` },
        style: {
          background: load >= 6 ? "#7f1d1d" : "#78350f",
          border: `1px solid ${load >= 6 ? "#dc2626" : "#d97706"}`,
          borderRadius: "4px",
          color: load >= 6 ? "#fca5a5" : "#fde68a",
          padding: "4px 8px",
          fontSize: "9px",
          fontFamily: "monospace",
          whiteSpace: "pre",
          textAlign: "center",
        },
      })

      edges.push({
        id: `${zone.id}-${nodeId}`,
        source: zone.id,
        target: nodeId,
        animated: true,
        style: { stroke: load >= 6 ? "#dc2626" : "#d97706", strokeWidth: 1.5 },
      })
    })
  })

  return { nodes, edges }
}

export function HvacGraph({ floor, complaints }: HvacGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = buildGraph(floor, complaints)
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="h-full min-h-[600px] relative">
      <div className="absolute top-4 left-4 z-10 bg-zinc-950/90 border border-zinc-800 rounded-lg p-3 text-xs space-y-1.5 text-zinc-400">
        <p className="font-medium text-zinc-300 mb-2">HVAC Knowledge Graph</p>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-blue-950 border border-blue-600" />
          Air handling unit (AHU)
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-stone-900 border border-stone-600" />
          Ventilation zone
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-amber-900 border border-amber-600" />
          Room with complaints
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-5 bg-orange-500 opacity-70 rounded-sm" />
          Animated = problem detected
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={{ background: "#09090b" }}
      >
        <Background color="#18181b" variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }} />
        <MiniMap
          style={{ background: "#18181b", border: "1px solid #27272a" }}
          nodeColor={(n) => {
            const bg = (n.style as Record<string, string>)?.background
            return bg ?? "#27272a"
          }}
        />
      </ReactFlow>
    </div>
  )
}
