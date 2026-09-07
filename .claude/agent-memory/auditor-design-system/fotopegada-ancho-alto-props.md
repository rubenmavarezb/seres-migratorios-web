---
name: fotopegada-ancho-alto-props
description: FotoPegada.astro gained optional ancho/alto CSS-length props (R22, QA visual Fase 2) matching FotoPegada.jsx; this made an OBSERVACIÓN in internos/Galeria.astro's JSDoc stale — it still claims the canonical component has no alto/ancho prop.
metadata:
  type: project
---

As of the working-tree diff reviewed 07.09.2026, `src/components/FotoPegada.astro` gained two optional props: `ancho`/`alto` (CSS length strings, e.g. `"420px"`), applied as inline `style` (dynamic per-instance geometry, same idiom as the existing `rotacion`), with `object-fit: cover` on the `<Image>` when `alto` is set. This matches `design/ds/components/fotos/FotoPegada.jsx` (`width: ancho, height: alto, objectFit: "cover"` when `alto`) and the Manifiesto lámina's "Cómo empezó" FotoPegada instances (420×300 desktop / 240×180 mobile, `ancho`/`alto` passed literally in `design/Manifiesto.dc.html`). No page wires these props yet — that's deferred to Fase 3 per the QA doc.

**Stale doc this creates**: `src/components/internos/Galeria.astro`'s JSDoc (around line 34-40, an `OBSERVACIÓN` block) says *"The canonical `FotoPegada.astro` of this repo has no `alto`/`ancho` prop ... and this ticket may not add props to it, so each photo keeps its natural aspect ratio"* — this is no longer true once `ancho`/`alto` exist on `FotoPegada.astro`. `Galeria.astro` itself doesn't use the new props (it still relies on dynamic inline custom properties for its own per-slot sizing, a different, legitimate need — column span/row/offset that `ancho`/`alto` don't cover), so the *decision* in `Galeria.astro` may still be sound, but the stated *reason* ("the canonical component has no such prop") is now factually wrong and should be corrected in a follow-up touching `Galeria.astro` — not urgent, but worth flagging to whoever picks up Fase 3 wiring so they don't rely on that outdated claim.

**Before re-flagging this in a future audit**: check `src/components/internos/Galeria.astro`'s current JSDoc — if it's been updated to reflect that `FotoPegada.astro` now has `ancho`/`alto`, this is resolved.
