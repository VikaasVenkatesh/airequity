import type { Json } from "@/lib/supabase/types"

export type TranscriptTurn = {
  speaker: "ai" | "candidate"
  text: string
}

/** Normalize Vapi-style transcript JSON into alternating AI / candidate turns. */
export function parseTranscriptFromJson(data: Json | null): TranscriptTurn[] {
  if (!data || !Array.isArray(data)) return []

  const out: TranscriptTurn[] = []
  for (const item of data) {
    if (!item || typeof item !== "object") continue
    const o = item as Record<string, unknown>
    const role = o.role
    const text = (
      typeof o.content === "string" ? o.content : typeof o.message === "string" ? o.message : ""
    ).trim()
    if (!text) continue
    if (role === "assistant") out.push({ speaker: "ai", text })
    else if (role === "user") out.push({ speaker: "candidate", text })
  }
  return out
}
