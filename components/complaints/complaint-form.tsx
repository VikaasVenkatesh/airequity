"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ComplaintSymptom } from "@/lib/types"

const SYMPTOMS: { id: ComplaintSymptom; label: string }[] = [
  { id: "headache", label: "Headache" },
  { id: "fatigue", label: "Fatigue / drowsiness" },
  { id: "stuffy", label: "Stuffy / stale air" },
  { id: "drafts", label: "Drafts / cold spots" },
  { id: "overheating", label: "Overheating" },
  { id: "cold", label: "Too cold" },
  { id: "odor", label: "Unusual odor" },
  { id: "eye_irritation", label: "Eye irritation" },
  { id: "condensation", label: "Condensation on windows" },
  { id: "noise", label: "HVAC noise" },
  { id: "other", label: "Other" },
]

interface ComplaintFormProps {
  rooms: { id: string; number: string; name?: string }[]
  defaultRoom?: string
  buildingId: string
  floorId: string
  returnUrl: string
}

export function ComplaintForm({ rooms, defaultRoom, buildingId, floorId, returnUrl }: ComplaintFormProps) {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState(defaultRoom ?? "")
  const [symptoms, setSymptoms] = useState<ComplaintSymptom[]>([])
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<number>(3)
  const [reportedBy, setReportedBy] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const toggleSymptom = (s: ComplaintSymptom) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoom) { setError("Please select a room."); return }
    if (symptoms.length === 0) { setError("Please select at least one symptom."); return }
    if (!description.trim()) { setError("Please describe the issue."); return }

    setError("")
    setSubmitting(true)

    try {
      const room = rooms.find((r) => r.number === selectedRoom)
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room?.id ?? `${buildingId}_${floorId.split("_").pop()}_${selectedRoom}`,
          roomNumber: selectedRoom,
          floorId,
          buildingId,
          reportedBy: reportedBy.trim() || undefined,
          symptoms,
          description: description.trim(),
          severity,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit complaint")
      router.push(returnUrl)
    } catch {
      setError("Failed to submit. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Room selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Room number <span className="text-red-500">*</span>
        </label>
        {rooms.length > 0 ? (
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 appearance-none"
          >
            <option value="">Select a room…</option>
            {rooms.filter(r => !['4135','4150'].includes(r.number)).map((r) => (
              <option key={r.id} value={r.number}>
                Room {r.number}{r.name ? ` — ${r.name}` : ""}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            placeholder="e.g. 4220"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
          />
        )}
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Symptoms <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleSymptom(id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                symptoms.includes(id)
                  ? "bg-cyan-950 border-cyan-700 text-cyan-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you're experiencing. Be as specific as possible — when does it happen, how long has it been going on, does it improve at certain times of day?"
          rows={4}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 resize-none placeholder:text-zinc-600"
        />
      </div>

      {/* Severity */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-300">
          Severity: <span className="text-zinc-400 font-normal">{severity} / 5</span>
        </label>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSeverity(n)}
              className={`flex-1 rounded-lg border py-3 text-sm font-semibold transition-colors ${
                severity === n
                  ? n >= 4
                    ? "bg-red-950 border-red-700 text-red-300"
                    : n >= 3
                      ? "bg-amber-950 border-amber-700 text-amber-300"
                      : "bg-emerald-950 border-emerald-700 text-emerald-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-600 px-1">
          <span>Minor discomfort</span>
          <span>Severe / urgent</span>
        </div>
      </div>

      {/* Reporter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Your name <span className="text-zinc-600 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={reportedBy}
          onChange={(e) => setReportedBy(e.target.value)}
          placeholder="Anonymous if left blank"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-white text-zinc-950 font-semibold py-2.5 text-sm hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit complaint"}
        </button>
        <button
          type="button"
          onClick={() => router.push(returnUrl)}
          className="rounded-lg border border-zinc-800 text-zinc-400 font-medium py-2.5 px-4 text-sm hover:bg-zinc-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
