-- ============================================================
-- Depth — Supabase Schema v1.0
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Companies using the platform
-- ------------------------------------------------------------
CREATE TABLE companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Job roles / open positions
-- ------------------------------------------------------------
CREATE TABLE roles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       UUID REFERENCES companies(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  job_description  TEXT NOT NULL,
  intake_notes     TEXT,
  seniority_level  TEXT DEFAULT 'new_grad'
                     CHECK (seniority_level IN ('new_grad', 'junior', 'mid')),
  interview_plan   JSONB,  -- AI-generated interview structure
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Individual candidates
-- ------------------------------------------------------------
CREATE TABLE candidates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id               UUID REFERENCES roles(id) ON DELETE CASCADE,
  company_id            UUID REFERENCES companies(id) ON DELETE CASCADE,
  name                  TEXT,
  email                 TEXT,
  resume_text           TEXT,
  interview_link_token  TEXT UNIQUE NOT NULL,
  status                TEXT DEFAULT 'pending'
                          CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Interview sessions
-- ------------------------------------------------------------
CREATE TABLE interviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id     UUID REFERENCES candidates(id) ON DELETE CASCADE,
  vapi_call_id     TEXT UNIQUE,
  started_at       TIMESTAMPTZ,
  ended_at         TIMESTAMPTZ,
  duration_seconds INT,
  transcript       JSONB,
  recording_url    TEXT,
  status           TEXT DEFAULT 'pending'
                     CHECK (status IN ('pending', 'active', 'completed', 'failed')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- AI-generated scorecards
-- ------------------------------------------------------------
CREATE TABLE scorecards (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id         UUID REFERENCES interviews(id) ON DELETE CASCADE,
  candidate_id         UUID REFERENCES candidates(id) ON DELETE CASCADE,

  -- Scores (1–5)
  technical_depth      INT CHECK (technical_depth BETWEEN 1 AND 5),
  cs_fundamentals      INT CHECK (cs_fundamentals BETWEEN 1 AND 5),
  communication_clarity INT CHECK (communication_clarity BETWEEN 1 AND 5),
  problem_solving      INT CHECK (problem_solving BETWEEN 1 AND 5),

  -- Overall
  overall_score        NUMERIC(3,1),
  recommendation       TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'no', 'strong_no')),

  -- Written outputs
  summary              TEXT,
  strengths            TEXT[],
  concerns             TEXT[],
  red_flags            TEXT[],
  standout_moments     TEXT[],

  -- Cheat detection
  cheat_signals        JSONB,

  generated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Indexes for common query patterns
-- ------------------------------------------------------------
CREATE INDEX idx_roles_company_id         ON roles(company_id);
CREATE INDEX idx_candidates_role_id       ON candidates(role_id);
CREATE INDEX idx_candidates_company_id    ON candidates(company_id);
CREATE INDEX idx_candidates_link_token    ON candidates(interview_link_token);
CREATE INDEX idx_interviews_candidate_id  ON interviews(candidate_id);
CREATE INDEX idx_interviews_vapi_call_id  ON interviews(vapi_call_id);
CREATE INDEX idx_scorecards_interview_id  ON scorecards(interview_id);
CREATE INDEX idx_scorecards_candidate_id  ON scorecards(candidate_id);

-- ------------------------------------------------------------
-- Row Level Security
-- Companies can only see their own data.
-- ------------------------------------------------------------
ALTER TABLE companies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;

-- Supabase Auth: auth.uid() maps to companies.id via the email claim.
-- The simplest pattern for MVP: each company row's id == their auth user id.
-- Enforce this by linking auth.users → companies on signup (see onboarding flow).

CREATE POLICY "companies: own row only"
  ON companies FOR ALL
  USING (id = auth.uid());

CREATE POLICY "roles: own company only"
  ON roles FOR ALL
  USING (company_id = auth.uid());

CREATE POLICY "candidates: own company only"
  ON candidates FOR ALL
  USING (company_id = auth.uid());

CREATE POLICY "interviews: own company candidates"
  ON interviews FOR ALL
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE company_id = auth.uid()
    )
  );

CREATE POLICY "scorecards: own company candidates"
  ON scorecards FOR ALL
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE company_id = auth.uid()
    )
  );

-- Webhook handler (service role key) bypasses RLS — no policy needed for that path.
