# Depth — Stack & Conventions

## File structure (Next.js App Router)
app/
  (auth)/login/page.tsx
  (dashboard)/
    layout.tsx
    page.tsx              ← pipeline view
    roles/[id]/page.tsx   ← role detail
    candidates/[id]/page.tsx ← scorecard
  interview/[token]/page.tsx ← candidate-facing call page
  api/
    webhooks/vapi/route.ts ← Vapi post-call webhook
components/
  ui/          ← shadcn components (don't edit)
  scorecard/   ← scorecard display components
  interview/   ← call UI components
lib/
  supabase/    ← client + server supabase helpers
  vapi/        ← vapi config + helpers
  claude/      ← anthropic client + prompts

## Naming conventions
- Components: PascalCase
- Files: kebab-case
- DB columns: snake_case
- API routes: /api/[resource]/[action]

## Key env vars needed
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
VAPI_API_KEY
VAPI_WEBHOOK_SECRET
ANTHROPIC_API_KEY

## Rules
- Never use 'use client' unless absolutely required — server components by default
- All DB queries go through lib/supabase helpers, never direct client calls in components
- Scorecard generation runs in Supabase Edge Function, not Next.js API route
- TypeScript strict mode always on