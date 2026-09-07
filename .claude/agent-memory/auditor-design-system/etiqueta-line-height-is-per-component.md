---
name: etiqueta-line-height-is-per-component
description: The "etiqueta" typographic role (design-system.md §4) shares one letter-spacing token (0.04em) across components, but its line-height is intentionally different per component — do not flag a bare leading-[N] arbitrary value on .boton/.caja-nombre/BloqueFicha as a missing token.
metadata:
  type: project
---

`--text-etiqueta` in `theme.css`'s `@theme` block only carries `--text-etiqueta--letter-spacing: 0.04em` (line 60) — no paired `--text-etiqueta--line-height`, unlike the `display` sizes which do define `--text-display-*--line-height`. This is not an oversight: the reference JSX components under `design/ds/components/` disagree on line-height for the same "etiqueta" role —

- `CajaNombre.jsx`: no explicit `lineHeight` (browser "normal", ~1.15–1.2 for Courier Prime) — `.caja-nombre` in `theme.css` implements this as `leading-none` (line-height 1) instead, which is a deliberate divergence from "copy the JSX exactly": it guarantees the 44px box (`min-h-11` + `py-3` + `border-2`) regardless of font-loading/browser line-height quirks, rather than relying on an approximate inherited value. Confirmed correct via the QA math: content 14px + padding 24px + border 4px = 42px < 44px min-height, so the box lands on the min-height floor either way.
- `Boton.jsx`: explicit `lineHeight: 1.2` — `.boton` implements this as `leading-[1.2]` (arbitrary bracket value), giving 48.8px total height (padding 28 + line-height 16.8 + border 4).
- `BloqueFicha.jsx` needs `leading-[1.35]` for its `dt`/`dd` — applied in `BloqueFicha.astro` per R06 as of the commit reviewed 07.09.2026 (see [[bloqueficha-caja-variante-regression]] for a real bug introduced by that same fix).
- `Pie.jsx` needs `leading-[1.4]` on both its `et` (label) and `val` (value) styles — applied in `Pie.astro` per R10, same commit; `val` also has no `letterSpacing` at all (browser normal), so the Astro fix correctly adds `tracking-normal` to cancel `text-etiqueta`'s automatic 0.04em on the value elements only (see [[tracking-wide-vs-text-etiqueta]]).

**Conclusion for future audits**: a bare `leading-[N]` (or `leading-none`) on one of these component classes is NOT a "hallazgo" asking for a new `@theme` token. Adding a single `--text-etiqueta--line-height` would be wrong — it would force one value across components whose real specs disagree (1, 1.2, 1.35, 1.4 across `.caja-nombre`/`.boton`/`BloqueFicha`/`Pie`). Only letter-spacing is genuinely shared for this role (0.04em everywhere) and is correctly tokenized as `--text-etiqueta--letter-spacing`; line-height is correctly left component-scoped. See [[tracking-wide-vs-text-etiqueta]] for the related letter-spacing bug this reasoning came out of.
