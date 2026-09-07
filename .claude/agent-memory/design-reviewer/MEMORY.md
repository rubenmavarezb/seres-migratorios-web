# design-reviewer — Project Memory

Patterns learned while reviewing this project's rendered UI. Keep entries to 1–3 lines
and reference the views/components they apply to. General patterns only — not per-run
war stories. Never store secrets, PII, or ephemeral state.

## How this app runs
_(base URL, dev command, route enumeration — fill in on first successful run)_

## Accepted exceptions to declared rules
_(cases where applying a DESIGN.md rule verbatim regresses the result, and why)_

## Confirmed recurring defects
_(patterns the user confirmed as real, and where they occur)_

## Known look-alikes / false positives
_(things that render like defects and are not — confirmed by the user)_

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Fuente de verdad visual: `design/ds/docs/design-system.md` (v1.2), las láminas `design/*.dc.html` y el `@theme` de `src/styles/theme.css`. NO hay `DESIGN.md`; no pedir `/design-init`.
- Bicolor: tinta negra + `azul-sello` sobre `papel`. Radio 0 en todo (excepción: `Sello` y números de `SelloHorario`). Sombra única `shadow-foto`, exclusiva de `FotoPegada`. Sin degradados.
- Tipografías: `font-display` (Anton), `font-mono` (Courier Prime), `font-manuscrita` (Gochi Hand, solo respaldo). Serial A es la fuente real de marca pero sin licencia web: no se usa.
- Rotaciones estáticas por `transform` inline con `data-rotacion` (FotoPegada ±2°, Anotacion −3°/2°). Movimiento solo DS §11: `opacity`, `translate`, `scale`, `clip-path`; nunca `transform`, nada rebota, sin parallax.
- Mayúsculas solo por `text-transform`; el contenido se escribe con su capitalización real.
- La colocación (grid, márgenes, ancho) vive siempre en un envoltorio, nunca en el componente canónico (diseno-web-indice.md, decisión 13).
- Los `.dc.html` necesitan React/ReactDOM UMD para renderizar; si no se pueden abrir, la spec son sus estilos inline y `design/_ds/**/tokens/`.
