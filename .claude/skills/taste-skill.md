---
name: Taste Skill (Frontend Design)
description: Premium frontend design system — DESIGN_VARIANCE:8, MOTION_INTENSITY:6. Bento grids, micro-interactions, distinctive aesthetics.
type: user
---

# Configuration
DESIGN_VARIANCE: 8      # Experimental, distinctive — avoid generic
MOTION_INTENSITY: 6     # Moderate motion, purposeful
VISUAL_DENSITY: 4       # Breathable layout, not cramped

# Design Language
- Glassmorphism: backdrop-blur-xl, bg-white/5, border border-white/10
- Gradient surfaces: from specific hue at low opacity to transparent
- Bento grid: asymmetric, mixed cell sizes, purposeful empty space
- Cards: subtle inner glow on hover (box-shadow: inset 0 1px 0 rgba(255,255,255,0.1))

# Color Palette (Dark Mode)
- Background: #030712 (gray-950)
- Surface: rgba(255,255,255,0.03)
- Border: rgba(255,255,255,0.08)
- Cyan accent: #22d3ee (cyan-400) — primary actions, highlights
- Violet accent: #a78bfa (violet-400) — secondary, graphs
- Amber accent: #fb923c (orange-400) — warnings
- Red: #f87171 (red-400) — critical

# Motion Patterns
- Card hover: translateY(-2px) + box-shadow increase (200ms ease-out)
- Button press: scale(0.97) at 0ms, scale(1) at 160ms
- Grid stagger: items animate in 40ms apart
- Background orbs: slow drift, 15–25s, low opacity blur circles

# Animated Backgrounds
- Aurora: multiple radial gradients, slow keyframe animation
- Particle field: small dots, very low opacity, gentle drift
- Gradient mesh: 4–6 color nodes, animated positions

# Micro-interactions
- Stat counters: count-up animation on mount
- Progress bars: animate width from 0 on mount
- Badges: subtle pulse on "active" state
- Icons: micro-rotate or scale on hover (1.1x, 150ms)

# What NOT to Do
- No pure flat colors for key UI surfaces
- No Inter/Roboto as the only typeface
- No static card grids (add hover states, subtle animations)
- No single-color icon set without visual hierarchy
- No 1:1 copy of Linear/Notion/Vercel aesthetic
