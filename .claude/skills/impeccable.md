---
name: Impeccable Design
description: 20 design commands for typography, color, layout, motion, and polish. /polish cleans up entire UI.
type: user
---

# Core Commands Available
- /animate — Purposeful motion that conveys state, not decoration
- /colorize — Add strategic color to monochrome interfaces without garish results
- /overdrive — Push past conventional limits: shaders, physics, 60fps, cinematic transitions
- /bolder — Push safe designs toward impact
- /polish — Meticulous final pass between good and great
- /layout — Fix spacing, rhythm, visual hierarchy
- /typeset — Fix generic or inconsistent typography
- /delight — Small moments of personality

# Motion Principles
- Motion should communicate: entrance, exit, state change, cause-effect
- Stagger entrance animations for lists (50ms between items)
- Exit animations are 70% the duration of entrances
- Background animations: low opacity (0.3–0.6), slow (8–20s loops)

# Color System
- Use OKLCH for perceptually uniform color steps
- Dark mode: surface #09090b, elevated #111112, border rgba(255,255,255,0.08)
- Accent colors: never pure hue — slightly desaturated and luminance-adjusted
- Max 3 accent colors in any one view; one should be dominant
- Gradient directions: 135deg for "energy", 180deg for "depth"

# Typography
- Avoid generic system fonts for headings — use a distinct display face
- Body: 14–16px, 1.5–1.6 line-height, zinc-400 for secondary
- Heading scale: 12px label → 14px body → 18px section → 24px page → 36px hero
- Letter-spacing: -0.02em for headings over 20px, normal for body

# Spacing Rhythm
- Base unit: 4px
- Card padding: 20–24px
- Section gaps: 32–48px
- Use consistent 8px or 12px gaps within component clusters

# Anti-Patterns to Avoid
- No Inter font for headings (too generic) — use Geist, Plus Jakarta Sans, or similar
- No flat neon glows on dark backgrounds
- No rainbow/pride gradients for decorative purposes
- No pure white text on pure black (use zinc-50 on zinc-950)
- No borders on every element — use space to separate
