---
name: text-size-utility-no-pisa-leading-none
description: A diferencia de tracking-wide, un text-xs/text-etiqueta (utilidad de tamaño de Tailwind v4) NO pisa el leading-none de .caja-nombre/.boton — su line-height lee la custom property compartida --tw-leading con fallback, así que el leading-none del componente sigue ganando. No marcar esta combinación como hallazgo.
metadata:
  type: project
---

Verificado empíricamente compilando el CSS de este proyecto (`npm run build`, grep sobre `dist/_astro/Base.*.css`), no solo por lectura de la spec de Tailwind:

```
.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}
.leading-none{--tw-leading:1;line-height:1}
.caja-nombre{...--tw-leading:1;...line-height:1;...}
```

`text-xs` (y por extensión `text-etiqueta`, que no define ni siquiera su propio `--text-etiqueta--line-height`) **no fija `--tw-leading` a un valor propio** — solo LEE la custom property compartida con `var(--tw-leading, <fallback>)`. Como `.caja-nombre` (capa `@layer components`) ya fija `--tw-leading: 1` vía su `leading-none` aplicado, y ninguna otra clase en el elemento vuelve a tocar `--tw-leading`, el valor cascadeado de esa custom property sigue siendo `1` sin importar que `.text-xs` (capa `@layer utilities`, que gana en la cascada de capas sobre `@layer components`) también escriba su propia declaración `line-height`: esa declaración se resuelve leyendo `var(--tw-leading)` = 1, así que el resultado final es el mismo `line-height: 1` de todos modos.

**Esto es distinto del caso `tracking-wide`** (ver [[tracking-wide-vs-text-etiqueta]]): `tracking-wide` SÍ fija `--tw-tracking` a un valor propio (0.025em), por eso pisa el `--text-etiqueta--letter-spacing` de una clase de tamaño aplicada después. `text-xs`/`text-etiqueta` no tienen un análogo de "leading-wide" acompañándolas en este código — nunca fijan `--tw-leading` por sí solas.

**Regla práctica para una futura auditoría**: si un componente combina `.caja-nombre`/`.boton` (o cualquier clase con `leading-none`/`leading-[N]` propio) con una utilidad `text-<tamaño>` agregada después en el array de clases, ESO SOLO es un hallazgo si la utilidad de tamaño viene acompañada de un `leading-*` explícito en la misma lista de clases (que si pisaría, por capa). Un `text-xs`/`text-etiqueta`/`text-display-*` solo, sin `leading-*` junto a él, no pisa el line-height del componente base — no reportarlo como "line-height no tokenizado" ni como conflicto de cascada. Confirma y generaliza lo que ya decía [[etiqueta-line-height-is-per-component]].
