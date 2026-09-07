# Accessibility Auditor - Agent Memory

This file maintains persistent memory for the accessibility-auditor agent across sessions.

## Purpose
Track accessibility (a11y) patterns, component-library guarantees, accepted exceptions, and recurring barriers for this project so audits stay precise over time.

---

## Framework Accessibility Standards

**Note:** These are the baseline conformance targets the agent audits against. Project-specific rules are captured in the sections below.

### Conformance Target
- WCAG 2.2, Level AA.
- Prefer native HTML semantics over ARIA. "No ARIA is better than bad ARIA."

### Semantic Structure
**Check for:**
- ❌ `<div>`/`<span>` with click handlers used as buttons or links
- ❌ Missing landmarks (`main`, `nav`, `header`, `footer`, `aside`)
- ❌ Heading levels that skip (h1 → h3), multiple h1 where inappropriate
- ✅ Native `<button>`, `<a href>`, `<nav>`, `<main>`, `<ul>/<ol>`

### Names, Roles & Values (ARIA)
**Check for:**
- ❌ Interactive elements with no accessible name
- ❌ Invalid or redundant `role` (e.g. `role="button"` on a `<button>`)
- ❌ `aria-*` referencing IDs that don't exist
- ❌ `aria-hidden="true"` on focusable/interactive content
- ✅ Accessible names via visible label, `aria-label`, or `aria-labelledby`

### Keyboard Operability
**Check for:**
- ❌ Click-only handlers with no keyboard equivalent
- ❌ Positive `tabIndex` values
- ❌ Custom widgets missing expected keys (Esc, arrows, Enter/Space)
- ✅ Full keyboard reachability and logical focus order

### Focus Management
**Check for:**
- ❌ `outline: none` with no visible replacement
- ❌ Focus not moved into opened dialogs/menus; not restored on close
- ❌ No focus trap in modal dialogs
- ✅ Visible focus indicators and managed focus for overlays

### Non-text Content
**Check for:**
- ❌ `<img>` without `alt` (decorative images must use `alt=""`)
- ❌ Icon-only controls without an accessible label
- ❌ Media without captions/transcripts
- ✅ Meaningful alt text; decorative images hidden from AT

### Forms
**Check for:**
- ❌ Inputs without an associated `<label>` / `aria-label` / `aria-labelledby`
- ❌ Placeholder used as the only label
- ❌ Error messages not linked via `aria-describedby`; missing `aria-invalid`
- ✅ Explicit label associations and programmatic error linking

### Motion & Preferences
**Check for:**
- ❌ Animation / auto-play without a `prefers-reduced-motion` guard
- ❌ Content that flashes more than 3 times per second
- ✅ Reduced-motion alternatives

---

## Project-Specific Accessibility

### Component Library A11y Guarantees
<!-- e.g. "Radix Dialog traps and restores focus — do not flag focus management on it" -->

### Accepted Exceptions
<!-- Justified deviations with rationale and where they apply -->

### Recurring Barriers
<!-- Real a11y issues confirmed by the user and where they tend to appear -->

### False Positives to Avoid
<!-- Patterns the user confirmed are fine; don't flag again -->

### Testing Coverage
<!-- What a11y testing is in place (axe, jest-axe, manual keyboard/SR passes) -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Objetivo AA. Foco visible siempre: outline 2 px `azul-sello`, offset 2 px; `outline: none` es hallazgo Critical. Objetivo táctil ≥ 44 px.
- Un solo `<h1>` por página sin saltos. `TitularPartido` es el `<h1>` del home y de la edición; `Pagina.astro` lo emite en las internas.
- Formularios: `<label for>` real, `aria-describedby` + `aria-invalid` en errores; honeypot `bot-field` con `hidden` y fuera del tab order.
- Lightbox con `<dialog>`: foco atrapado, `Esc` cierra, el foco vuelve al disparador.
- `prefers-reduced-motion` anula rotaciones (`[data-rotacion]` → `transform: none`), las entradas DS §11 (`data-entrada`) y las View Transitions. Nunca `opacity: 0` fuera del bloque guardado de `theme.css`.
- `alt` de una frase manuscrita = transcripción literal en español; decorativas con `alt=""` y `aria-hidden`. Un `alt` `[ENTRE CORCHETES]` es un placeholder pendiente, no un `alt` vacío: reportarlo como contenido pendiente, no como falla técnica.
- `rounded-full` solo en `Sello` y en los números del `SelloHorario`: no es un desvío.
- Herramientas: `eslint-plugin-jsx-a11y` activo vía ESLint. Sin axe todavía (previsto en SM-059 con `@axe-core/playwright`); `tests/e2e/` está vacío.
