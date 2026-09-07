---
name: 'componente-astro-canonico'
description: 'Cómo se escribe un componente Astro de Seres Migratorios: JSDoc de cabecera que cita el design system y el ticket, interface Props en español, tokens del @theme, texto por t(), imágenes por astro:assets, colocación fuera del componente y movimiento solo con data-entrada. Cargar al crear o editar cualquier archivo de src/components/ o src/layouts/.'
globs: 'src/components/**/*.astro, src/layouts/*.astro'
---

# componente-astro-canonico

## Resumen

Patrón único para los 16 componentes canónicos, los helpers de `components/internos/` y los layouts `Base` y `Pagina`. Está destilado de los componentes ya mergeados (`FotoPegada`, `Boton`, `Pagina`) y de `CLAUDE.md`. Si un componente nuevo no sigue esto, el `auditor-design-system` lo va a marcar.

## Conceptos clave

- **Componente canónico**: uno de los 16 nombres exactos de `CLAUDE.md` (`BloqueFicha`, `TitularPartido`, `CajaNombre`, `Sello`, `Escudo`, `Anotacion`, `FotoPegada`, `FichaFotografo`, `SelloHorario`, `PalabrasClave`, `FranjaAliados`, `HiloTricolor`, `Boton`, `Campo`, `Nav`, `Pie`). No se renombran ni se traducen. Todo lo demás va en `internos/`.
- **Referencia de diseño**: `design/ds/docs/design-system.md` §7 (componentes) y §11 (movimiento), la spec de canvas en `design/ds/canvas/`, y la implementación React de referencia en `design/ds/components/**/*.jsx`. Se traduce a Astro con tokens, nunca se copia como React.
- **Envoltorio vs. componente**: la colocación (grid, márgenes, ancho, `overflow`, `position`) vive en el envoltorio del caller (diseno-web-indice.md, decisión 13). El componente no acepta clases de posición.
- **`OBSERVACIÓN`**: bloque en el JSDoc que documenta un desvío entre la spec y la lámina, o un posible error de diseño que NO se arregla unilateralmente.
- **Movimiento DS §11**: entradas por scroll con `data-entrada`, keyframes en `theme.css` dentro de los dos guards; nunca `opacity: 0` fuera de ahí, nunca animar `transform`.

## Patrones a seguir

### Cabecera JSDoc que cita la fuente

Cada componente abre con un JSDoc en inglés que nombra la sección del design system, el bloque del canvas, el archivo `.jsx` de referencia y el ticket. Es lo que permite revisar contra la spec sin buscarla.

```astro
---
/**
 * Boton — canonical button/link (design-system.md §7, item 13; canvas spec
 * at design/ds/canvas/Componentes.dc.html, block "03 · BOTON"; reference
 * implementation at design/ds/components/formularios/Boton.jsx, translated
 * here to theme.css classes + Tailwind, never copied as React).
 *
 * OBSERVACIÓN (letter-spacing): `.boton` already applies `tracking-wide`, so
 * `text-etiqueta` cannot apply its own 0.04em; theme.css is outside this
 * ticket's Alcance, reported instead of fixed.
 */
---
```

### `interface Props` literal, en español, camelCase

Siempre una `interface Props` escrita a mano (no `ComponentProps<typeof X>`), props en camelCase en español, valores por defecto en el destructuring. Uniones cerradas para variantes.

```astro
---
interface Props {
  imagen: ImageMetadata;
  alt: string;
  variante?: 'pegada' | 'recortada' | 'sangrada';
  rotacion?: number;
  bordePx?: 6 | 8 | 10;
  prioridad?: boolean;
}

const {
  imagen,
  alt,
  variante = 'pegada',
  rotacion = 0,
  bordePx = 8,
  prioridad = false,
} = Astro.props;
---
```

### Solo tokens del `@theme` y clases de Tailwind

Colores, fuentes y sombra salen de `src/styles/theme.css`. Las clases de componente (`.boton`, `.foto-pegada`, `.caja-nombre`) ya viven ahí; el `.astro` solo suma utilidades de tamaño y variantes.

```astro
<!-- ✅ CORRECTO — token del @theme y clase del theme.css -->
<a class="boton boton--sello text-etiqueta">…</a>
<div class="border-2 border-tinta bg-papel text-azul-sello">…</div>
```

### Texto visible por `t()`, contenido con su capitalización real

Nunca un string legible dentro del markup. El componente recibe `idioma` y busca en el diccionario; la mayúscula la pone `uppercase`.

```astro
---
import { type Idioma, t } from '../i18n/utils.ts';
interface Props {
  idioma: Idioma;
}
const { idioma } = Astro.props;
---

<span class="font-mono uppercase">{t(idioma, 'ficha.edicion')}</span>
```

### Imágenes por `astro:assets`

`<Image>` o `<Picture>` con `alt` real; `loading="lazy"` con `widths` y `sizes` salvo el hero, que lleva `priority`.

```astro
<Image
  src={imagen}
  alt={alt}
  widths={widths}
  sizes={sizes}
  loading={prioridad ? undefined : 'lazy'}
  priority={prioridad || undefined}
  class="block h-auto w-full"
/>
```

### Rotación estática con `data-rotacion`, entrada con `data-entrada`

La rotación va como `transform` inline más el atributo que `theme.css` usa para anularla bajo reduced-motion. La entrada es solo un atributo: los keyframes y los guards viven en `theme.css`.

```astro
<div data-entrada data-rotacion style={`transform: rotate(${rotacionClamp}deg)`}>…</div>
```

### Imports relativos con extensión

```ts
import Base from './Base.astro';
import { type Idioma, t } from '../i18n/utils.ts';
```

## Anti-patrones

### Color, fuente o sombra fuera de token

```astro
<!-- ❌ MAL — hex inline y paleta de Tailwind; el auditor lo marca Critical -->
<div class="bg-[#1B4BAF] text-gray-500 shadow-lg rounded-md">…</div>
```

**Fix**: `bg-azul-sello text-grafito`, sin sombra (solo `shadow-foto` en `FotoPegada`), sin radio.

### Texto hardcodeado o en mayúsculas

```astro
<!-- ❌ MAL — no pasa por t() y la mayúscula está en el contenido -->
<span>EDICIÓN 01</span>
```

**Fix**: `{t(idioma, 'ficha.edicion')}` con la clave en `es.json` y `en.json`, y `uppercase` en la clase.

### Colocación dentro del componente

```astro
<!-- ❌ MAL — el componente decide dónde va -->
<div class="absolute -top-8 right-4 overflow-hidden">…</div>
```

**Fix**: el componente rinde su caja; el caller la envuelve en un `<div class="absolute …">`.

### Entrada animada sin guards

```css
/* ❌ MAL — arranca invisible en un navegador sin view() o con reduced-motion */
[data-entrada] {
  opacity: 0;
  animation: aparecer 400ms forwards;
}
```

**Fix**: keyframes en `theme.css` dentro de `@media (prefers-reduced-motion: no-preference)` y `@supports ((animation-timeline: view()) and (animation-range: entry))`, animando `opacity` y `translate`.

### Arreglar `theme.css` o la spec de oficio

Un desvío entre lámina y `sitemap.md`, o un bug de `theme.css` fuera del Alcance del ticket, se documenta como `OBSERVACIÓN` en el JSDoc y se reporta. No se corrige sin ticket.

## Ejemplos

### Ejemplo 1 — variante nueva en un componente

**Contexto**: `Boton` necesita una variante `chico`.

**Antes**: `<a class="boton" style="padding: 8px 16px">`.

**Después**: agregar `chico?: boolean` a `Props`, componer `class:list={['boton', chico && 'py-2 px-4']}` y documentar en el JSDoc de dónde salen los 8/16 px (canvas `Componentes.dc.html`).

**Por qué**: la variante entra por prop tipada y utilidades de Tailwind; el inline style no es auditable ni responde a tokens.

### Ejemplo 2 — helper que no es canónico

**Contexto**: hace falta un componente de galería en grilla.

**Antes**: `src/components/Galeria.astro`.

**Después**: `src/components/internos/Galeria.astro`, con el mismo patrón de JSDoc y `Props`.

**Por qué**: la lista de 16 es cerrada; lo ajeno al design system va en `internos/`.

## Referencias

- `CLAUDE.md` raíz, secciones "Convenciones", "Imágenes", "Accesibilidad mínima obligatoria".
- `design/ds/docs/design-system.md` §7 y §11; `design/ds/docs/movimiento-y-animacion.md`.
- `src/styles/theme.css` (`@theme` y clases de componente).
- Skill relacionada: `.claude/skills/contenido-y-i18n/SKILL.md` para las claves de `t()`.

---

## Cuándo invocar esta skill

Al crear o editar cualquier `.astro` bajo `src/components/` o `src/layouts/`, y al traducir un `.jsx` de `design/ds/components/` a Astro. No aplica a páginas (`src/pages/`): para eso está `paginas-bilingues`.
