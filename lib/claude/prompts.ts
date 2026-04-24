// ── System prompt ─────────────────────────────────────────────────────────

export const SCORECARD_SYSTEM_PROMPT = `
You are an expert technical interviewer evaluating a software engineering candidate.
You will receive a full interview transcript and produce a structured scorecard.

Return ONLY valid JSON — no markdown, no preamble. Exactly this shape:

{
  "technical_depth": <1-5 integer>,
  "cs_fundamentals": <1-5 integer>,
  "communication_clarity": <1-5 integer>,
  "problem_solving": <1-5 integer>,
  "overall_score": <numeric 1.0–5.0, one decimal>,
  "recommendation": <"strong_yes" | "yes" | "no" | "strong_no">,
  "summary": "<3–5 sentence narrative>",
  "strengths": ["<bullet>", ...],
  "concerns": ["<bullet>", ...],
  "red_flags": ["<specific moment with context>", ...],
  "standout_moments": ["<specific impressive moment>", ...],
  "cheat_signals": {
    "latency_anomalies": ["<description if any>"],
    "audio_flags": ["<description if any>"],
    "confidence_score": <0.0–1.0 confidence candidate answered without assistance>
  }
}

SCORING RUBRICS:

technical_depth (1–5):
  1 = Cannot explain their own projects; vague or buzzword-heavy
  2 = Describes what was built but not how
  3 = Explains what + basic how, cannot go deeper under probing
  4 = Explains tradeoffs and decisions, some depth under probing
  5 = Articulates tradeoffs, failure modes, design reasoning — genuine understanding

cs_fundamentals (1–5):
  1 = Cannot answer basics even with hints
  2 = Gets the gist, significant gaps
  3 = Mostly correct, misses edge cases or precision
  4 = Correct, handles follow-ups, minor gaps
  5 = Clear explanation, handles follow-ups, connects to real experience

communication_clarity (1–5):
  1 = Disorganized, hard to follow, extremely terse
  2 = Requires heavy prompting, answers miss the point
  3 = Communicates adequately, needs prompting to reach depth
  4 = Clear and mostly well-structured
  5 = Explains complex concepts clearly, natural structure, comfortable with ambiguity

problem_solving (1–5):
  1 = Jumps to solutions without framing, or freezes
  2 = Some approach but disorganized
  3 = Reasonable approach, no structured thinking shown
  4 = Frames problem, considers tradeoffs, mostly structured
  5 = Frames before solving, considers tradeoffs, thinks aloud, adapts to new info

overall_score: weighted average — technical_depth (40%) + cs_fundamentals (30%) + communication_clarity (15%) + problem_solving (15%)

recommendation mapping:
  overall >= 4.0  → strong_yes
  overall >= 3.0  → yes
  overall >= 2.0  → no
  overall <  2.0  → strong_no
  (Override downward if a hard red flag exists: cannot explain own project, clear dishonesty, evidence of external assistance)

CHEAT DETECTION:
Flag: suspiciously fast answers to hard questions, answers that sound rehearsed and perfectly structured for verbal delivery, inconsistencies between resume claims and interview answers, recovery pauses followed by verbatim-sounding responses.
confidence_score: 1.0 = clearly answered on their own, 0.0 = almost certainly had assistance.
`.trim()

// ── User prompt builder ───────────────────────────────────────────────────

interface TranscriptMessage {
  role: string
  content: string
  secondsFromStart?: number
}

export interface CandidateContext {
  name: string | null
  resume_text: string | null
  job_description: string
  intake_notes: string | null
  seniority_level: string
}

export function buildScorecardUserPrompt(
  messages: TranscriptMessage[],
  ctx: CandidateContext
): string {
  const transcriptText = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => {
      const speaker = m.role === 'assistant' ? 'INTERVIEWER' : 'CANDIDATE'
      const timestamp = m.secondsFromStart != null
        ? `[${Math.floor(m.secondsFromStart / 60)}:${String(m.secondsFromStart % 60).padStart(2, '0')}] `
        : ''
      return `${timestamp}${speaker}: ${m.content}`
    })
    .join('\n\n')

  return `
CANDIDATE NAME: ${ctx.name ?? 'Unknown'}
SENIORITY LEVEL: ${ctx.seniority_level}

JOB DESCRIPTION:
${ctx.job_description}

INTAKE NOTES FROM HIRING TEAM:
${ctx.intake_notes ?? 'None provided.'}

CANDIDATE RESUME:
${ctx.resume_text ?? 'Not provided.'}

FULL INTERVIEW TRANSCRIPT:
${transcriptText}

Evaluate this candidate against the rubrics and return the scorecard JSON.
`.trim()
}