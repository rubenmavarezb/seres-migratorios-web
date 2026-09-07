# Documentation Writer - Agent Memory

This file maintains persistent memory for the documentation-writer agent across sessions.

## Purpose
Track documentation standards, style preferences, and project-specific documentation needs.

## Documentation Style Guide
<!-- Project-specific documentation tone and style -->
<!-- Example: Formal vs casual, use of emojis, code example formatting -->

## Terminology & Glossary
<!-- Project-specific terms and their definitions -->
<!-- Consistent terminology to use across all documentation -->

## Target Audiences
<!-- Primary documentation consumers and their needs -->
<!-- Example: End users, API consumers, internal developers -->

## Existing Documentation Structure
<!-- Overview of current docs organization -->
<!-- /docs structure, README sections, inline comment patterns -->

## Documentation Gaps
<!-- Areas lacking documentation -->
<!-- Features or APIs that need docs -->

## Frequently Asked Questions
<!-- Common questions that should be documented -->
<!-- Questions from users or developers -->

## Documentation Standards
<!-- Agreed-upon documentation practices -->
<!-- Example: JSDoc format, markdown conventions, example requirements -->

## Past Documentation Tasks
<!-- Recent documentation created or updated -->
<!-- Feedback received on documentation quality -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- `README.md` es mínimo a propósito: la documentación del repo es `CLAUDE.md`. No ampliar el README sin pedido.
- `CLAUDE.md` es copia byte a byte de `~/Documents/Seres Migratorios/03-Web/CLAUDE.md` (paso `claude` de `scripts/importar-fuentes.mjs`). Un cambio se hace en el archivo fuente y se reimporta; editarlo solo en el repo se pierde.
- Docs técnicas puntuales van en `docs/*.md` (ejemplo: `docs/notas-astro-7.md`). Capturas de revisión en `docs/capturas/`.
- Comentarios y JSDoc en inglés; prosa para Ruben y contenido del sitio en español (voz directa, cálida, colectiva, voseo suave, sin emojis).
- No inventar datos en ejemplos ni docs: fechas, links y nombres solo del contenido; lo que falte, `[PLACEHOLDER ENTRE CORCHETES]`.
