"use client"

export function AuroraBg() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Aurora layer 1 — cyan */}
      <div
        className="absolute -top-[30%] -left-[10%] h-[70%] w-[60%] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)",
          animation: "aurora-1 18s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />

      {/* Aurora layer 2 — violet */}
      <div
        className="absolute top-[10%] right-[5%] h-[60%] w-[50%] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 70%)",
          animation: "aurora-2 22s ease-in-out infinite",
          filter: "blur(50px)",
        }}
      />

      {/* Aurora layer 3 — teal-emerald */}
      <div
        className="absolute bottom-[0%] left-[20%] h-[50%] w-[60%] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)",
          animation: "aurora-3 26s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}
