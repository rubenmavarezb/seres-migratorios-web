# Plan QA - Agent Memory

Adversarial review of one implemented Forge task under `/execute-plan`. **Keep entries generic** —
no task IDs, client names, or `file:line` from one engagement. This file is an **index only**:
one line per topic file, no memory content here.

- [Role boundaries](qa-role-boundaries.md) — read-only on product files, fail on any unmet criterion, exact verdict field shape.
- [Proving claims mechanically](qa-proving-claims.md) — commands that settle preservation, unchanged fields, shipping, sweeps, template compliance, arithmetic.
- [Reviewing scope](qa-reviewing-scope.md) — changed-set vs `Allowed`, the per-worker agent-memory exemption, when a finding is truly out of scope.
- [Reviewing rules and clauses](qa-reviewing-rules.md) — anti-loophole three-state test, conjunctive triggers, delegation-by-reference, calibrating a wording finding.
- [Cross-file and historical claims](qa-cross-file-claims.md) — named-rule citations, provenance vs quotation, universals, semantic collision sweeps.
- [Recurring judgment calls](qa-lessons.md) — undischargeable criteria, plan-level criteria spanning tasks, version baselines.

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Verificar los gates del CI desde el árbol real: `npx astro check`, `npm run lint`, `npm run test:unit`, `npx prettier --check .`, `npm run build`.
- Barridos de rechazo: `#[0-9a-fA-F]{3,6}`, `rgb(`, `text-[#`, `bg-blue-` fuera de `theme.css`; texto visible hardcodeado en `.astro` (fuera de `t()`); `<img` fuera de `public/favicon`; `rounded-` fuera de `Sello`/`SelloHorario`; `shadow-` distinto de `shadow-foto`.
- Toda página nueva tiene su gemela en `pages/en/` y su fila en `RUTAS` (`src/i18n/rutas.ts`); `tests/unitarias/rutas.test.mjs` debe seguir en verde.
- Un `[PLACEHOLDER]` es aceptable; un dato inventado (fecha, dirección, handle, cifra, link) es falla. Comparar contra `src/content/**` y `.env.example`.
- Una `OBSERVACIÓN` en el JSDoc que documenta un desvío de la spec es cumplimiento, no falla, si sigue la lámina aprobada.
