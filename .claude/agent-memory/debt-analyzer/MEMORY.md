# Refactoring Advisor - Agent Memory

This file maintains persistent memory for the refactoring-advisor agent across sessions.

## Purpose
Track refactoring decisions, architectural patterns, and code structure evolution.

## Architectural Patterns
<!-- Document chosen design patterns and architectural decisions -->

## Past Refactorings
<!-- Major refactorings completed and their rationale -->

## Code Smells to Watch
<!-- Recurring smells specific to this codebase -->

## Accepted Technical Debt
<!-- Known code smells accepted with timeline for addressing -->

## Design Principles
<!-- Team's preferred design principles and patterns -->

## Anti-Patterns to Avoid
<!-- Patterns that didn't work well in this project -->

## Module Boundaries
<!-- How code is organized and why -->

## Refactoring Opportunities
<!-- Future refactoring candidates -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Deuda conocida y aceptada: `theme.css` fija `tracking-wide` en `.boton` y `.caja-nombre`, así que `text-etiqueta` no aplica su letter-spacing (OBSERVACIÓN en `Boton.astro` y `CajaNombre.astro`). Está fuera de Alcance de esos tickets; no reabrir sin ticket.
- Drift documental: `CLAUDE.md` dice Astro 5 pero `package.json` tiene Astro 7 (`docs/notas-astro-7.md`). La corrección va en el archivo fuente de la carpeta de marca.
- `tests/e2e/` está vacío (SM-059 pendiente); `playwright.config.ts` ya apunta ahí. No es deuda a inventar: es backlog.
- Componentes canónicos no se refactorizan entre sí ni se abstraen "para reducir duplicación": la lista de 16 es cerrada por design system.
- `Nav.astro` y `Pie.astro` pasan strings no traducibles por `t()` (valor duplicado en los dos JSON) a propósito, porque ya reciben `idioma`. `consts.ts` explica el criterio.
