import { headers } from "next/headers"

/** Absolute origin for shareable links (interview URLs). */
export async function getSiteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (fromEnv) return fromEnv

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  if (host) return `${proto}://${host}`

  return "http://localhost:3000"
}
