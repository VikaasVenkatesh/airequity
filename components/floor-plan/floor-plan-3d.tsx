"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Text, Environment, Grid } from "@react-three/drei"
import * as THREE from "three"
import type { Floor, Complaint, Room } from "@/lib/types"

// ── Helpers ─────────────────────────────────────────────────────────────────

function complaintSeverityForRoom(room: Room, complaints: Complaint[]) {
  const rc = complaints.filter((c) => c.roomNumber === room.number)
  if (rc.length === 0) return 0
  return Math.max(...rc.map((c) => c.severity))
}

function roomColor(severity: number, selected: boolean) {
  if (selected) return new THREE.Color("#22d3ee")
  if (severity === 0) return new THREE.Color("#1e293b")
  if (severity <= 2) return new THREE.Color("#064e3b")
  if (severity === 3) return new THREE.Color("#78350f")
  if (severity === 4) return new THREE.Color("#7f1d1d")
  return new THREE.Color("#991b1b")
}

function emissiveColor(severity: number, selected: boolean) {
  if (selected) return new THREE.Color("#0e7490")
  if (severity === 0) return new THREE.Color("#000000")
  if (severity <= 2) return new THREE.Color("#022c22")
  if (severity === 3) return new THREE.Color("#451a03")
  return new THREE.Color("#450a0a")
}

// ── SVG→3D coordinate mapping ─────────────────────────────────────────────
// SVG: 0–1120 x, 0–420 y  →  3D: centered at origin, scale 0.015
const SVG_SCALE = 0.014
const SVG_OFFSET_X = -(1120 * SVG_SCALE) / 2
const SVG_OFFSET_Z = -(420 * SVG_SCALE) / 2

function svgTo3D(x: number, y: number, w: number, h: number) {
  return {
    x: x * SVG_SCALE + (w * SVG_SCALE) / 2 + SVG_OFFSET_X,
    z: y * SVG_SCALE + (h * SVG_SCALE) / 2 + SVG_OFFSET_Z,
    w: w * SVG_SCALE - 0.04,
    d: h * SVG_SCALE - 0.04,
  }
}

// ── Room box ─────────────────────────────────────────────────────────────────
function RoomBox({
  room,
  severity,
  selected,
  onClick,
}: {
  room: Room
  severity: number
  selected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const { x, z, w, d } = svgTo3D(room.x, room.y, room.w, room.h)
  const baseHeight = 0.05
  const extraHeight = severity > 0 ? severity * 0.18 : 0
  const height = baseHeight + extraHeight
  const yPos = height / 2

  const color = roomColor(severity, selected || hovered)
  const emissive = emissiveColor(severity, selected || hovered)

  useFrame(() => {
    if (!meshRef.current) return
    const targetY = (selected ? height / 2 + 0.05 : height / 2)
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1
  })

  const isSpecial = room.type === "stairwell" || room.type === "elevator"

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[x, yPos, z]}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (!isSpecial) onClick() }}
        onPointerOver={() => { if (!isSpecial) setHovered(true); document.body.style.cursor = isSpecial ? "default" : "pointer" }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default" }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w, height, d]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered || selected ? 0.5 : 0.2}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Room label — only show if hovered or selected */}
      {(hovered || selected) && !isSpecial && (
        <Text
          position={[x, height + 0.15, z]}
          fontSize={0.08}
          color={selected ? "#22d3ee" : "#e2e8f0"}
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {room.number}
        </Text>
      )}

      {/* Severity indicator dot above room */}
      {severity >= 4 && (
        <mesh position={[x, height + 0.12, z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#f87171"
            emissive="#dc2626"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  )
}

// ── Floor plane ───────────────────────────────────────────────────────────
function FloorPlane({ width, depth }: { width: number; depth: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[width + 1, depth + 1]} />
      <meshStandardMaterial color="#0a0f1e" roughness={1} />
    </mesh>
  )
}

// ── Zone label ────────────────────────────────────────────────────────────
function ZoneLabel({ label, position, color }: { label: string; position: [number, number, number]; color: string }) {
  return (
    <Text position={position} fontSize={0.14} color={color} anchorX="center" anchorY="middle">
      {label}
    </Text>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────
function Scene({
  floor,
  complaints,
  selectedRoom,
  onSelectRoom,
}: {
  floor: Floor
  complaints: Complaint[]
  selectedRoom?: string
  onSelectRoom: (n: string | undefined) => void
}) {
  const totalW = floor.svgWidth * SVG_SCALE
  const totalD = floor.svgHeight * SVG_SCALE

  const rooms = useMemo(
    () => floor.rooms.filter((r) => r.type !== "corridor"),
    [floor.rooms]
  )

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-6, 8, -4]} intensity={0.4} color="#22d3ee" />
      <pointLight position={[6, 6, 4]} intensity={0.3} color="#a78bfa" />

      {/* Floor plane */}
      <FloorPlane width={totalW} depth={totalD} />

      {/* Grid overlay */}
      <Grid
        position={[0, 0, 0]}
        args={[totalW + 1, totalD + 1]}
        cellSize={0.56}
        cellThickness={0.3}
        cellColor="#1e293b"
        sectionSize={2.24}
        sectionThickness={0.5}
        sectionColor="#1e3a5f"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Zone labels */}
      <ZoneLabel label="ZONE B — SOUTH" position={[-4, 0.1, -2.5]} color="#52525b" />
      <ZoneLabel label="ZONE A — NORTH" position={[2.5, 0.1, -2.5]} color="#1e3a5f" />

      {/* Zone separator */}
      <mesh position={[SVG_OFFSET_X + 485 * SVG_SCALE, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, totalD]} />
        <meshStandardMaterial color="#1e3a5f" opacity={0.5} transparent />
      </mesh>

      {/* Room boxes */}
      {rooms.map((room) => {
        const severity = complaintSeverityForRoom(room, complaints)
        return (
          <RoomBox
            key={room.id}
            room={room}
            severity={severity}
            selected={selectedRoom === room.number}
            onClick={() => onSelectRoom(selectedRoom === room.number ? undefined : room.number)}
          />
        )
      })}
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
interface FloorPlan3DProps {
  floor: Floor
  complaints: Complaint[]
  selectedRoom?: string
  onSelectRoom?: (n: string | undefined) => void
}

export function FloorPlan3D({ floor, complaints, selectedRoom, onSelectRoom }: FloorPlan3DProps) {
  const handleSelect = (n: string | undefined) => onSelectRoom?.(n)

  if (floor.rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 rounded-xl border border-white/10 border-dashed">
        <p className="text-sm text-zinc-600">3D floor plan not yet available for this floor.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#030712]" style={{ height: 480 }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 8], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#030712" }}
      >
        <Scene
          floor={floor}
          complaints={complaints}
          selectedRoom={selectedRoom}
          onSelectRoom={handleSelect}
        />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2.1}
          minDistance={2}
          maxDistance={20}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
