"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, Loader2 } from "lucide-react"

interface DiagnoseButtonProps {
  buildingId: string
  floorId: string
  openCount: number
}

export function DiagnoseButton({ buildingId, floorId, openCount }: DiagnoseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDiagnose = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId, floorId }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? "Diagnosis failed")
      }

      const diag = await res.json() as { id: string }
      router.push(`/diagnoses/${diag.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDiagnose}
        disabled={loading || openCount === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}
        {loading ? "Diagnosing…" : "Run AI diagnosis"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
