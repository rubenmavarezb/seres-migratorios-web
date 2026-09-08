---
name: pseudo-area-de-toque-padding-box
description: El truco de "::before absolute + inset negativo" para ampliar el área de toque de un link sin cambiar la caja visible entrega MENOS de lo pedido cuando el host tiene border — el contenedor del pseudo es el padding-box, no el border-box, así que hay que sumarle el ancho del borde al inset.
metadata:
  type: project
---

Confirmado en vivo (Chrome DevTools vía `javascript_tool`, build de este PR, 07.09.2026) en dos componentes independientes que comparten `.caja-nombre` (`border-2`, `position: relative` en el host): el chip ES/EN de `Nav.astro` y el chip "Edición 01 — Buenos Aires 2026" de `FichaFotografo`/`CajaNombre` en `/artistas/herick-frontado/`. Ambos usan el patrón `relative` + `before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']` para llevar una caja de 32px a un área de toque de 44px sin tocar la caja visible.

**Medido, no supuesto**: `getComputedStyle(a, '::before').height` da **40px**, no 44, en los dos casos (caja visible 32px + antes/después la resta da 4px arriba y 4px abajo, no los 6px que pide `-inset-y-1.5`).

**Causa**: por spec CSS (containing block de un `position: absolute` cuyo ancestro tiene `position: relative`), el contenedor del `::before` es el **padding-box** del host, no su border-box. `.caja-nombre` tiene `border-2` (2px), así que el padding-box mide 2px menos que el border-box a cada lado. Un `inset: -6px` calculado desde el padding-box aterriza a solo `6 - 2 = 4px` más allá del border-box visible — de ahí los 40px (32 + 4 + 4) en vez de 44 (32 + 6 + 6).

**Fix correcto**: sumarle el ancho del borde al inset pedido. Con `border-2`, para ampliar 6px más allá de la caja visible hace falta `inset: -8px` (`-inset-y-2` en Tailwind, no `-inset-y-1.5`). Fórmula general: `inset magnitude = expansión-deseada + border-width` del host, siempre que el host tenga `position: relative` directo (no un wrapper intermedio) y el pseudo cuelgue de él.

El mismo defecto aplica al eje horizontal: `before:inset-x-0` (sin restar el borde) deja el pseudo 2px más angosto que la caja visible a cada lado — inofensivo en la práctica porque el propio `<a>` (border-box) ya es nativamente clickeable ahí, pero conceptualmente el pseudo no debería ser MÁS CHICO que la caja que dice igualar; si se quiere prolijo, `-inset-x-0.5` (2px) en vez de `inset-x-0`.

**Cómo detectarlo en una futura auditoría**: cualquier `before:`/`after:` con `-inset-*` negativo cuyo objetivo documentado es un número de px concreto (ej. "amplía a 44px"), aplicado sobre un host con `border-*` no-cero y `relative` — no confiar en el número del inset tal cual está escrito; medirlo en el navegador (`getComputedStyle(el, '::before')`) o sumar el border-width a mano antes de dar el hallazgo por bueno. Ver el precedente sin este bug en `FichaFotografo.astro` (`claseLinkNombre`, patrón "stretched link" con `after:inset-0` — ahí no hay compensación de borde porque el objetivo es cubrir TODO el padre, no un número de px exacto, así que el mismo defecto no se nota).

Ver también [[tracking-wide-vs-text-etiqueta]] para otro caso de "el número en la clase no es el número que llega a pantalla" en este mismo design system.
