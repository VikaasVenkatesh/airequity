"use client"

import { Download } from "lucide-react"

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors"
    >
      <Download className="h-4 w-4" />
      Export / Print
    </button>
  )
}
