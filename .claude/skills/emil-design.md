---
name: Emil Kowalski Design Engineering
description: Animation and motion principles for polished UI — easing, duration, spring physics, component patterns
type: user
---

# Animation Decision Framework
- Only animate if the element appears frequently AND serves a purpose (communicates state, guides attention, provides feedback)
- Never animate for decoration alone

# Easing Rules
- NEVER use `ease-in` for UI — it feels sluggish
- Use `ease-out` (cubic-bezier(0,0,0.2,1)) for all entrances
- Use `ease-in-out` for elements moving between two states
- Prefer custom cubic-bezier curves over CSS defaults
- Spring physics for interactive/draggable elements

# Duration Rules
- Button press feedback: 100–160ms
- Tooltips, small popovers: 150ms
- Modals, drawers: 200–350ms
- Page transitions: 300–500ms
- Never exceed 500ms for UI feedback
- Micro-interactions should feel instant (<150ms)

# What to Animate
- ONLY `transform` and `opacity` — never width, height, margin, padding
- Use `clip-path` for reveal animations
- Scale buttons on press: `transform: scale(0.97)` at 100ms, back at 200ms
- Stagger list/grid items: 30–50ms delay between each

# Spring Physics
- Use for elements that respond to user gestures (drag, resize)
- Damping: 0.8–0.9 for snappy feel
- Stiffness: 300–500 for UI (not bouncy)

# Component Patterns
- Tooltips: skip delay if another tooltip is already open
- Popovers: animate from origin point (transform-origin matches trigger position)
- Modals: scale from 0.95 to 1 + fade in; never slide from edge
- Dropdowns: origin-aware, scale + opacity

# Review Checklist
- [ ] Does every animation have a purpose?
- [ ] Are all durations under 300ms for feedback?
- [ ] Is easing custom or at least ease-out?
- [ ] Are only transform/opacity being animated?
- [ ] Do interactive elements have press/hover states?
