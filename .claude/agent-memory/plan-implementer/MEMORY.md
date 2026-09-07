# Plan Implementer - Agent Memory

Persistent memory for the plan-implementer agent across sessions: implementing one scoped
Forge task under `/execute-plan` — staying inside `Allowed`, producing a parseable verdict,
and reporting honestly when something cannot be done.

**Keep entries generic and self-contained.** No task/plan IDs, rule IDs, client or repo
names, or `file:line` citations from a specific engagement — that evidence belongs in the
task file and the commit. If a lesson only makes sense with a task number attached, it is
not a lesson yet.

## Index

- [Role boundaries and verdict](role-boundaries-and-verdict.md) — lifecycle state is
  controller-owned; verdict block parsing and format rules.
- [Scope discipline](scope-discipline.md) — what `Allowed` covers, mid-run scope grants,
  flag-don't-fix for out-of-scope defects, drafting conventions when extending prose.
- [Verification and falsification sweeps](verification-and-falsification-sweeps.md) —
  evidence discipline, two-directional sweeps, grep pitfalls, editing precision.
- [Quality gates and multi-item tasks](quality-gates-and-multi-item-tasks.md) — structural
  gate equivalents when there's no package manifest; independent-artifact tasks.
- [Derivation and precedent](derivation-and-precedent.md) — deriving values fresh from repo
  state rather than from a task's own narrative; reusing precedent reasoning correctly.
- [Skill authoring conventions](skill-authoring-conventions.md) — skill auto-invocation is
  description-driven not glob-driven; validate SKILL.md frontmatter with a real YAML parser.
- [Human-only observation legs](human-only-observation-legs.md) — when a DoD item is an
  observation an agent can't structurally produce, report `blocked` with proxy evidence, never
  stretch a simulation into a pass.
- [Shell-script fault injection](shell-script-fault-injection.md) — stub reachability, the
  bash `if var=$(pipeline)` exit-code idiom, testing mixed partial-failure cases, and
  reporting rather than force-deleting gated scratch fixtures.

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Tickets `SM-NNN`; commits `SM-NNN: descripción en español` (ver `git log`). Rama actual de fase: `kiro/fase-2-home`; contenido en `contenido/<tipo>-<slug>`.
- Gates antes de PR, en este orden: `npx astro check`, `npm run lint`, `npm run test:unit`, `npx prettier --check .`, `npm run build`, `npx playwright test`.
- Un desvío entre spec (sitemap.md / PLAN.md) y la lámina aprobada se resuelve siguiendo la lámina y documentándolo como `OBSERVACIÓN` en el JSDoc del archivo, no arreglando la spec.
- `theme.css` y `CLAUDE.md` no se tocan fuera del Alcance explícito del ticket. Un color nuevo va al `@theme` y al design system, nunca inline.
- Todo texto visible nuevo entra en `es.json` y `en.json` a la vez (`[EN PENDIENTE]` si no hay traducción). Toda ruta nueva entra en `RUTAS` de `rutas.ts` con su par EN.
- Dependencias: ninguna sin preguntar.
