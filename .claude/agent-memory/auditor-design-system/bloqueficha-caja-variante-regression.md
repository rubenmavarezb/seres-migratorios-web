---
name: bloqueficha-caja-variante-regression
description: BloqueFicha.astro's R06 fix (docs/qa-visual/fase-2.md) shares dt/dd classes and the outer <dl> gap between variante="papel" and variante="caja", even though R06 explicitly says "la variante caja no cambia" — check whether this has been fixed before re-flagging it.
metadata:
  type: project
---

Found auditing the working-tree diff of `src/components/BloqueFicha.astro` on 07.09.2026 (six R06/R09/R10/R11/R12/R22 fixes from `docs/qa-visual/fase-2.md`, not yet committed as of the audit).

**The bug**: pre-fix, `BloqueFicha.astro`'s `dt`/`dd` markup and the outer `<dl>`'s gap class were never conditioned on the `variante` prop — only the wrapper's border/padding (`clasesVariante`) differed between `papel` and `caja`. This meant both variants shared one typography (13px label/tracking-wide, 14px/400 value, `gap-5`=20px). `docs/qa-visual/fase-2.md` line 585 (kit page, "aspectos verificados que coinciden") independently confirms that shared old styling was *correct* for `caja` — it matches `design/ds/canvas/Componentes.dc.html` line 114 exactly (padding 20/22, border 2px, gap 20px, labels 13px, values 14px) — while being *wrong* for `papel` (R06's actual finding, sourced from `BloqueFicha.jsx` and the four page láminas: 14px/700/leading-1.35 for both dt and dd, no gap between them, 24px between columns).

R06's fix instruction is explicit: *"Quitar la línea y el padding de la variante `papel`; `dt` y `dd` a `text-etiqueta font-bold leading-[1.35]` con el letter-spacing del token; `gap-6`. La variante `caja` no cambia."* The trailing sentence scopes the entire fix to `papel` only.

**What the diff actually did**: it replaced the shared `dt`/`dd` classes with the new `CLASE_LINEA` (`font-mono text-etiqueta font-bold uppercase leading-[1.35]`) unconditionally, and changed the outer `<dl>`'s gap from `gap-5` to `gap-6` unconditionally — both changes apply to `caja` too, since neither is gated on `variante`. This regresses `variante="caja"` (visible on `/kit`, section `#bloqueficha`, second example — not yet used on any production page) away from its previously-verified match against `Componentes.dc.html`, contradicting R06's own "no cambia" clause.

**Correct fix**: branch `CLASE_LINEA` (and the per-group `gap-1.5` between dt/dd, and the outer `<dl>` gap) on `variante`, so `caja` keeps the pre-fix values (`text-metadatos font-bold uppercase tracking-wide` for dt, `text-[0.875rem] font-normal uppercase` for dd, `gap-1.5` per group, `gap-5` on the `<dl>`) while `papel` gets the new R06 values.

**Before re-flagging this in a future audit**: re-check `src/components/BloqueFicha.astro` — if `CLASE_LINEA`/the gap are now conditioned on `variante` (or `caja` was removed/reworked), this is resolved and this memory is stale.
