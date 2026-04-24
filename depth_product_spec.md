# Depth — Product Spec v1.0
 *AI-powered technical phone screen for software engineering roles*

By Shrey Varma - solo founder, graduating from the University of Maryland College Park in May 2026 with a CS degree 

---

## What We're Building

Depth is an AI interviewer that conducts genuine, adaptive technical phone screens for software engineering roles — the kind a senior engineer would run, not a checklist. Companies send candidates a link, the AI conducts a 25–35 minute voice/video conversation that probes real technical understanding, and hiring managers receive a structured scorecard within minutes of the call ending.

The product replaces the recruiter phone screen AND the first engineering phone screen in one call. It is sold to employers, not candidates.

---

## The Problem

Companies hiring software engineers face a broken screening process:

1. ATS receives 200–500 applications per role
2. A recruiter does 30-minute phone screens to filter to ~20 candidates (this is mostly logistics: salary, availability, broad experience fit — not technical evaluation)
3. An engineer spends 45–60 minutes doing a technical screen (this is the expensive part — senior engineers doing 5+ screens/week burn out, context-switch constantly, and evaluate inconsistently)
4. ~8 candidates go to full loop

Step 3 is the bottleneck. It costs $350–$450/interview outsourced (Karat), burns irreplaceable senior engineer time internally, and still produces inconsistent results because different engineers evaluate differently.

Existing AI tools (HeyMilo, Alex/Apriora) handle step 2 well — they're great at generic pre-screening ("do you have 3 years of Python? What's your visa status?") but cannot genuinely evaluate technical depth. They ask about experience; they don't probe understanding.

---

## The Solution

An AI that conducts step 3 — the real technical screen — at $25–40/interview with the quality of a senior engineer doing it themselves.

The AI:
- Reads the candidate's resume before the call starts
- Opens with "walk me through your most technically complex project"
- Probes adaptively based on what the candidate says: "you mentioned Redis for caching — why Redis over Memcached? What tradeoffs did you consider?"
- Evaluates CS fundamentals through reasoning, not code submission: "explain why your API was slow and how you diagnosed it"
- Asks 1–2 verbal system design or CS fundamentals questions appropriate for the seniority level
- Detects evasion, shallow answers, and inconsistencies in real time
- Delivers a structured scorecard within 2 minutes of call end

The key differentiator: we evaluate *understanding*, not *claims*. Anyone can say they've used Kubernetes. We ask "explain what happens when a pod crashes and how Kubernetes decides what to do next" — and we know what a good answer looks like.

---

## Target Customer (MVP)

**Primary:** Series A/B tech startups (20–150 employees) hiring their first 5–20 engineers.
- Pain: CTOs and senior engineers are doing all technical screens themselves
- Pain: No dedicated recruiting team, getting flooded with applications
- Pain: Can't afford Karat ($350+/interview), don't want to outsource to a generic agency
- Willingness to pay: $500–$2,000/month for a tool that handles their technical screening pipeline

**Secondary (later):** Staffing agencies that place software engineers — they get paid per placement, so more throughput = more revenue. They'll pay on a per-interview basis.

**Not MVP:** Enterprise (Google, Meta, etc.) — they have internal tools. Roles other than SWE — we focus here first.

---

## MVP Scope (First 6 Weeks)

### What's In

- One role type: Software engineer (new grad through mid-level, 0–4 years experience)
- One interview format: 25–30 minute voice call via browser (no phone required)
- Company onboarding: paste job description + optional intake notes → system generates interview plan
- Candidate experience: company sends shareable link → candidate joins voice call from browser → AI conducts interview
- Scorecard output (auto-generated within 2 min of call end):
  - Overall recommendation: Strong yes / Yes / No / Strong no
  - Scores (1–5): Technical depth, CS fundamentals, Communication clarity, Problem-solving approach
  - Written summary (3–5 sentences): what they did well, what concerned us, recommended next step
  - Full transcript
  - Recording (audio)
  - Red flags flagged inline (e.g., "candidate could not explain their own architecture decision when probed")
- Company dashboard: pipeline view of all candidates, sortable by score, click into individual scorecards
- Basic auth: company login (email/password via Supabase Auth)
- Cheat detection signals: response latency anomalies, audio artifacts suggesting off-camera help, flagged in scorecard

### What's Out of MVP

- Video (audio-only first — simpler, lower latency, still works)
- ATS integrations (Greenhouse, Lever, etc.) — manual workflow first
- Multiple role types
- White labeling
- Candidate-facing feedback/reports
- Mobile app
- Bulk import / CSV upload
- Analytics dashboard (beyond basic pipeline view)

---

## Interview Design (Core Product Logic)

### Interview Structure (25–30 min)

**Phase 1: Project deep-dive (10–12 min)**
- Open: "Walk me through the most technically complex project you've worked on. Start with what it did and then go into how you built it."
- Follow-up probes (adaptive, based on what they say):
  - Why did you choose [technology] over [alternative]?
  - What was the hardest part of building this?
  - If you were starting over, what would you do differently?
  - How did you handle [specific technical challenge implied by their answer]?
  - What happened when [thing they described] broke or didn't perform as expected?

**Phase 2: CS fundamentals + systems (10–12 min)**
- 1–2 questions drawn from a role-appropriate bank, asked conversationally not as a quiz
- Examples for new grad / junior level:
  - "Explain to me what happens, at a high level, when you type a URL into a browser and press enter."
  - "You have a list of a million user records and need to find duplicates — how do you think about solving that?"
  - "Your API endpoint is responding slowly under load. Walk me through how you'd diagnose the problem."
  - "Explain the difference between a SQL and NoSQL database and when you'd choose each."
- The AI follows up on answers — a wrong answer isn't a fail, it's an opportunity to probe further

**Phase 3: Behavioral / fit signal (5–6 min)**
- "Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?"
- "What's the last technical concept you learned on your own, outside of school or work?"
- "What part of building software do you find most interesting right now?"

**Phase 4: Close (2 min)**
- "Do you have any questions about the role or the company?" (company info provided in job description context)
- Brief explanation of next steps

### Evaluation Rubric (what the AI scores on)

**Technical depth (1–5)**
- 1: Cannot explain their own projects at a technical level; answers are vague or buzzword-heavy
- 3: Can explain what they built and basic how, but cannot go deeper when probed
- 5: Can explain tradeoffs, articulate why they made decisions, discuss failure modes, and demonstrate genuine understanding vs. surface-level familiarity

**CS fundamentals (1–5)**
- 1: Cannot answer basic fundamentals questions even with probing
- 3: Gets the gist but misses precision or edge cases
- 5: Explains concepts clearly, handles follow-up questions, and connects fundamentals to real-world experience

**Communication clarity (1–5)**
- 1: Answers are disorganized, hard to follow, or extremely terse
- 3: Communicates adequately but requires significant prompting to get to the point
- 5: Explains technical concepts clearly and concisely, structures answers naturally, comfortable with ambiguity

**Problem-solving approach (1–5)**
- 1: Jumps to solutions without framing the problem, or freezes entirely
- 3: Approaches problems reasonably but doesn't show structured thinking
- 5: Frames problems before solving, considers tradeoffs, thinks out loud clearly, updates their approach based on new information

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui component library
- **Deployment:** Vercel (free tier for MVP)

### Backend / Database
- **Platform:** Supabase
  - PostgreSQL database
  - Auth (email/password for companies)
  - Edge Functions (post-call scorecard generation)
  - Storage (interview recordings)
  - Realtime (optional: live scorecard generation progress)

### Voice / Interview Engine
- **Voice platform:** Vapi.ai
  - Handles real-time STT/TTS loop
  - Web SDK embedded directly in Next.js app (no phone required)
  - ~$0.05/minute infrastructure cost → ~$1.50 per 30-min interview
  - Webhook delivers full transcript + metadata on call end
- **Underlying LLM (during call):** Claude Sonnet via Vapi config
  - Sonnet chosen for speed + quality balance in real-time conversation
  - Opus too slow for voice latency requirements

### AI / Scoring
- **Post-call scorecard generation:** Claude Opus via Anthropic API
  - Called via Supabase Edge Function triggered by Vapi webhook
  - Input: full transcript + interview rubric + job description context
  - Output: structured JSON scorecard → stored in Supabase → rendered in dashboard
  - Sonnet acceptable here if cost becomes a concern
- **System prompt:** Encodes the full evaluation rubric, scoring definitions, red flag signals, and adaptive probing logic

### Development Tools
- **IDE:** Cursor (with Claude Sonnet as underlying model)
- **AI coding:** Claude Code (CLI) for long autonomous tasks
- **Design/wireframes:** v0.dev for component generation, Excalidraw for quick flow sketches
- **Version control:** GitHub (repo: github.com/shredible26/depth or similar)

---

## Database Schema (Initial)

```sql
-- Companies using the platform
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job roles / open positions
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  intake_notes TEXT,
  seniority_level TEXT DEFAULT 'new_grad', -- new_grad | junior | mid
  interview_plan JSONB, -- AI-generated interview structure
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual candidates
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  resume_text TEXT, -- parsed from upload or paste
  interview_link_token TEXT UNIQUE NOT NULL, -- the shareable link token
  status TEXT DEFAULT 'pending', -- pending | in_progress | completed | cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview sessions
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  vapi_call_id TEXT UNIQUE, -- Vapi's ID for the call
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INT,
  transcript JSONB, -- full transcript from Vapi
  recording_url TEXT, -- stored in Supabase Storage
  status TEXT DEFAULT 'pending', -- pending | active | completed | failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated scorecards
CREATE TABLE scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  
  -- Scores (1-5)
  technical_depth INT CHECK (technical_depth BETWEEN 1 AND 5),
  cs_fundamentals INT CHECK (cs_fundamentals BETWEEN 1 AND 5),
  communication_clarity INT CHECK (communication_clarity BETWEEN 1 AND 5),
  problem_solving INT CHECK (problem_solving BETWEEN 1 AND 5),
  
  -- Overall
  overall_score NUMERIC(3,1), -- computed average
  recommendation TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'no', 'strong_no')),
  
  -- Written outputs
  summary TEXT, -- 3-5 sentence narrative summary
  strengths TEXT[], -- array of strength bullets
  concerns TEXT[], -- array of concern bullets
  red_flags TEXT[], -- specific flagged moments with transcript references
  standout_moments TEXT[], -- specific impressive moments
  
  -- Cheat detection
  cheat_signals JSONB, -- { latency_anomalies: [], audio_flags: [], confidence_score: 0.92 }
  
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## User Flows

### Flow 1: Company onboards a new role
1. Company signs up / logs in
2. Clicks "New Role"
3. Pastes job description + optional intake notes ("we need React experience, distributed systems is a plus, team is 6 people")
4. System (Claude) generates an interview plan: 3–4 specific topics to probe, tailored questions for this role
5. Company reviews/edits the interview plan
6. Role is live — company can now add candidates

### Flow 2: Company adds a candidate
1. Company pastes candidate's resume (text or PDF upload)
2. Optionally adds candidate email for auto-invite
3. System generates a unique interview link (e.g., depth.ai/i/abc123)
4. Company sends link to candidate (manually for MVP — just copy the link)
5. Candidate record appears in pipeline with status "Pending"

### Flow 3: Candidate takes the interview
1. Candidate clicks link → lands on a clean, minimal interview page
2. Brief intro: "This is an AI-conducted technical screen for [Company] for the [Role] position. It will take approximately 25–30 minutes. When you're ready, click Start Interview."
3. Mic permission check → call starts
4. AI greets candidate by name, explains the format briefly, begins
5. 25–30 minute conversation
6. AI wraps up: "That's everything I needed — thank you. [Company] will be in touch with next steps."
7. Call ends → candidate sees "Interview complete" screen

### Flow 4: Hiring manager reviews scorecard
1. Dashboard shows updated candidate status: "Completed ✓"
2. Click candidate → scorecard view
3. Scorecard shows: overall recommendation badge, 4 score bars, written summary, strengths/concerns, red flags, full transcript with timestamps
4. Hiring manager clicks "Move forward" or "Pass" — updates pipeline status
5. Recording available to play back if desired

---

## The System Prompt (Core IP — v0.1 Draft)

This is the most important piece of the product. It lives in the Vapi config as the AI's instruction set.

```
You are a senior software engineer conducting a technical phone screen on behalf of [COMPANY_NAME]. 
You are interviewing [CANDIDATE_NAME] for the [ROLE_TITLE] position.

Here is the job description:
[JOB_DESCRIPTION]

Here is the candidate's resume:
[RESUME_TEXT]

Here is what the hiring team specifically wants to assess:
[INTAKE_NOTES]

INTERVIEW STRUCTURE:
You will conduct a 25-30 minute interview in three phases:

PHASE 1 — Project deep-dive (10-12 minutes):
Open with: "Thanks for joining today, [CANDIDATE_NAME]. I want to start by having you walk me through the most technically complex project you've worked on. Start with what it did and then go into how you built it."

As they speak, identify:
- Technologies they claim to have used
- Architecture decisions they describe
- Problems they say they solved

Then probe on each of these. Do not accept surface-level answers. Good follow-up probes:
- "Why did you choose [X] over [alternative]? What tradeoffs were you thinking about?"
- "What was the hardest engineering problem in that project?"
- "What broke first when you put this under load / in production?"
- "If you were rebuilding this today, what would you do differently?"
- "Walk me through how [specific component they mentioned] actually worked under the hood."

A candidate who truly built something can explain it in detail and handle unexpected questions about it. A candidate who didn't understand what they built will deflect, generalize, or give inconsistent answers when probed.

PHASE 2 — CS fundamentals (10-12 minutes):
Select 1-2 questions from the following, appropriate for [SENIORITY_LEVEL]:
[QUESTION_BANK_FOR_LEVEL]

Do not ask these as a quiz. Frame them naturally:
- "I want to shift gears and ask you about something a bit more foundational..."
- Follow up on their answers. A partially correct answer is not a fail — probe further.
- If they struggle, offer a hint and see if they can recover.

PHASE 3 — Behavioral signal (5-6 minutes):
Ask one behavioral question. Listen for: self-awareness, collaboration, intellectual curiosity.
- "Tell me about a technical disagreement you had with a teammate. How did it resolve?"
- "What's something technical you've learned recently, on your own?"

CLOSE (2 minutes):
"That's everything I needed from my end — do you have any questions about the role?"
Answer factual questions about the role using the job description. For questions you can't answer, say "Great question — the team will be able to go into more detail on that."
End: "Thanks so much, [CANDIDATE_NAME]. [COMPANY_NAME] will be in touch with next steps soon."

EVALUATION PRINCIPLES:
- Evaluate understanding, not just claims. Anyone can name a technology; probe whether they understand it.
- Probe inconsistencies. If they say something that contradicts an earlier statement, note it and explore.
- Don't penalize nervousness. A nervous candidate who recovers and shows depth is better than a smooth candidate with no substance.
- Calibrate to seniority. A new grad not knowing distributed systems is fine. Not being able to explain their own project is not.
- Stay conversational. This is a phone screen, not an interrogation. Be warm, curious, and professional.

THINGS TO FLAG FOR THE SCORECARD:
- Could not explain their own project when probed
- Claimed experience with X but could not answer basic questions about X
- Gave suspiciously fast, perfectly formed answers (possible external assistance)
- Inconsistencies between resume claims and interview answers
- Could not recover from a hint on a fundamental question
- Exceptional: explained something complex exceptionally clearly, showed genuine curiosity, demonstrated depth beyond what was asked
```

---

## Pricing Model (Post-MVP)

- **Starter:** $299/month — up to 20 interviews/month (~$15/interview)
- **Growth:** $799/month — up to 60 interviews/month (~$13/interview)
- **Scale:** $1,999/month — up to 200 interviews/month + priority support (~$10/interview)
- **Per-interview (staffing agencies):** $35/interview, minimum $200/month

Infrastructure cost per interview: ~$3–5 (Vapi ~$1.50 + Claude API ~$1–3)
Gross margin at Starter: ~80%

---

## Go-to-Market (First 30 Days)

### Target: 3 paying beta customers before building a single line of frontend

1. **Your network first:** Reach out to founders, CTOs, and engineering leads you know from UMD, FinTech startup, data company. Ask: "I'm building an AI that does technical phone screens for SWEs. Can I show you a demo and get your honest take?"

2. **LinkedIn outreach:** Target CTOs/VPs Engineering at Series A/B startups (LinkedIn Sales Navigator free trial). Message: "We're building an AI that runs your technical phone screens for SWE roles at ~$30/interview vs $350 for Karat. Happy to run your next 5 interviews free in exchange for feedback."

3. **YC Startup School / Slack communities:** Post in #hiring channels. Founders who are posting "looking for senior engineers" are your exact buyer.

4. **The ask:** Free for the first 5 interviews in exchange for:
   - 30-minute feedback call after each interview
   - Data on whether the candidate was advanced or rejected
   - 90-day follow-up: "How did the hire work out?"

---

## Success Metrics (MVP)

- **Product:** Scorecard correlates with hiring decision at >70% rate (candidate recommended "yes" → company advances them)
- **Quality:** Companies say "this told me something useful I wouldn't have gotten from a resume" — measured by feedback form after each scorecard
- **Retention:** Beta companies use it for their next open role without being asked
- **Leading indicator:** Time-to-complete per interview (target: <30 min average)

---

## What We Are NOT Building

- A LeetCode replacement or automated coding assessment
- A candidate-side coaching tool (that's Final Round AI's problem)
- A generic "AI recruiter" for all roles (HeyMilo's problem)
- A video interview async platform (HireVue's problem)
- An ATS

We are building the AI equivalent of a senior engineer doing a technical phone screen. That's it, done extremely well, for one role type to start.

---

## Open Questions (Resolve Before Building)

1. **Video vs audio-only for MVP?** Audio-only is simpler and lower latency, but video lets the AI detect reading from a second screen. Recommendation: audio-only first, add video in v2.
2. **How does the candidate upload their resume?** Options: (a) company pastes it when adding the candidate, (b) candidate uploads it on the interview landing page. Recommendation: company pastes it — fewer friction points for the candidate pre-call.
3. **How do we handle a candidate who goes way off-topic or tries to derail the interview?** The system prompt needs a graceful redirect pattern.
4. **Legal/compliance:** Do we need to notify candidates they're speaking to an AI? Almost certainly yes in most jurisdictions. Add this to the pre-interview disclosure on the landing page.

---

## Immediate Next Steps

1. Set up Vapi account and get a working voice call running with Claude as the AI
2. Write and iterate v1 of the system prompt — interview yourself and a friend using it
3. Design the 3 core screens in Excalidraw: interview setup, candidate call page, scorecard view
4. Build the Supabase schema (above)
5. Build the candidate interview page (the call UI) — this is the core product
6. Build post-call scorecard generation (Vapi webhook → Edge Function → Claude Opus → Supabase)
7. Build the hiring manager dashboard (pipeline view + scorecard detail)
8. Talk to 10 potential customers before or during build — do not wait until launch
