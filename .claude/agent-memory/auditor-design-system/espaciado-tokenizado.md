---
name: espaciado-tokenizado
description: theme.css tokeniza el espaciado vía la escala --spacing de Tailwind; una prop de gap/separación dinámica debe restringirse a esa escala y usar clases gap-N, nunca CSS length libre inline.
metadata:
  type: project
---

`src/styles/theme.css` (bloque `@theme`, sección "Espaciado", líneas ~65-78) documenta explícitamente que la escala de espaciado NO se sobreescribe: usa el `--spacing: 0.25rem` por defecto de Tailwind v4, y da la tabla de equivalencia con el BRIEF: `espacio-1 (4px) = gap-1`, `espacio-2 (8px) = gap-2`, `espacio-3 (12px) = gap-3`, `espacio-4 (16px) = gap-4`, `espacio-5 (24px) = gap-6`, `espacio-6 (32px) = gap-8`, etc. (a partir de espacio-5 diverge del número de Tailwind).

Esto significa que **el espaciado SÍ tiene tokens**, aunque mi checklist de categorías (§1 del prompt del agente) no lista "espaciado" como categoría explícita junto a Color/Radio/Sombra. La regla general de CLAUDE.md "Solo clases de Tailwind y tokens del `@theme`" aplica también acá.

Patrón correcto ya establecido en el repo para una prop de espaciado dinámico por página: `FranjaAliados.astro` tiene `separacion`/`separacionMobile` (números en px, Spanish, con el mobile como prop INDEPENDIENTE que no cae al valor desktop — comentario explícito: "Independiente... NO cae a él"). Mismo patrón para `altoLogo`/`altoLogoMobile`.

**Cómo aplicar**: si un componente necesita una prop de gap/espaciado que varía por breakpoint o por página, y los valores necesarios caen en la escala de 4px (8, 12, 16, 24, 32...), la prop debe:
1. Nombrarse en español (`separacion`, no `gap` — aunque la referencia .jsx del design system y hasta el doc de QA interno usen "gap" en inglés informalmente, eso no es la convención del código Astro).
2. Tiparse como un union restringido al step de la escala (`0 | 1 | 2 | 3 | 4`, etc.), nunca `string` libre.
3. Aplicarse como clase Tailwind `gap-N` (con `md:` para el breakpoint desktop si hace falta un valor distinto), nunca como `style` inline con un CSS length arbitrario.
4. Si necesita variar por breakpoint, agregar `<nombre>Mobile` como prop independiente (no fallback automático al valor desktop), replicando `separacionMobile`.

Encontrado en la auditoría de `TitularPartido.astro` (fix R01 de `docs/qa-visual/fase-2.md`): la prop nueva `gap?: string` se aplicaba vía `row-gap: ${gap}` inline, con un comentario JSDoc que decía "no hay token para esto" — afirmación incorrecta dado lo de arriba. Además le faltaba la variante mobile: la lámina (`Home.dc.html:51` desktop `gap="8px"` vs `:161` mobile `gap="4px"`; `Edicion.dc.html:48` desktop `gap="16px"` vs `:197` mobile `gap="12px"`) pide valores distintos por breakpoint, igual que ya resuelve `alinear`/`alinearMobile` en el mismo componente.

Ver también [[nombres-props-ingles-en-referencia-jsx]] si se crea esa entrada.
