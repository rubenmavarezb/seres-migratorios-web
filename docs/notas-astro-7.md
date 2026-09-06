# Notas de Astro 7 para este repo

Los documentos de `~/Documents/Seres Migratorios/03-Web/` (PLAN, modelo de contenido, CLAUDE.md) se escribieron contra la API de Astro 5. Rubén decidió construir con **Astro 7.3.1** (última estable al 06.09.2026). Estas notas resumen lo verificado contra la documentación oficial (`docs.astro.build`, guías "Upgrade to v6" y "Upgrade to v7") y lo que cambia respecto de lo que dicen esos documentos. Cualquier API que no esté acá y sea posterior a junio de 2026 se verifica en docs antes de usarla; si difiere del PLAN o del modelo de contenido, va como OBSERVACIÓN en el reporte de la tarea.

## Entorno

- `astro@7.3.1`, Vite 8, `zod@4` (se importa como `z` desde `astro/zod`).
- Node **22.12 o superior** (la 6 dejó de soportar 18 y 20). Este repo fija Node 22 en `.nvmrc` y en `netlify.toml`.
- `astro check` sigue necesitando `@astrojs/check` y `typescript` instalados (aprobados por Rubén).
- Tailwind 4 se instala con `npx astro add tailwind`: agrega `@tailwindcss/vite` a `vite.plugins` y crea `src/styles/global.css` con `@import "tailwindcss"`. `@astrojs/tailwind` está deprecado y no se usa.

## Cambios de la 7 que afectan cómo se escribe el código

- **Compilador en Rust, más estricto.** Toda etiqueta no vacía se cierra explícitamente; el HTML semánticamente inválido (por ejemplo un bloque dentro de `<p>`) ya no se corrige solo: se escribe HTML válido.
- **`compressHTML` por defecto es `'jsx'`**: colapsa texto multilínea y quita espacios alrededor de elementos según reglas JSX. Para no perder espacios entre elementos inline (links en el `Nav`, "ETIQUETA:" y valor, botones seguidos) este repo fija `compressHTML: true` en `astro.config.mjs`, que es el comportamiento de la 5 (compresión sin pérdida). Decisión de SM-005; anotada como OBSERVACIÓN.
- **Markdown con Sätteri** en lugar de remark/rehype. El cuerpo de una entrada se renderiza con `render(entry)` de `astro:content` (`const { Content } = await render(entry)`).
- `@astrojs/db` no existe más (no se usaba). Los internos de `astro:transitions` removidos no se usan: las View Transitions de este sitio son cross-document por CSS, sin `<ClientRouter />`.

## Cambios de la 6 que afectan lo escrito en el modelo de contenido

- **Zod 4.** `z.string().url()` sigue funcionando pero está deprecado: usar `z.url()`. `z.ZodTypeAny` se reemplaza por `z.ZodType` en helpers genéricos como `oPlaceholder`. `z.string().regex(re, 'mensaje')`, `z.coerce.date()`, `z.enum`, `z.union`, `.default()` y `.optional()` funcionan igual. `reference('coleccion')` e `image()` (vía `schema: ({ image }) => ...`) no cambian; `glob` sigue en `astro/loaders`.
- **i18n.** `i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } }` es válido tal cual. `routing.redirectToDefaultLocale` ahora es `false` por defecto y **solo** se admite con `prefixDefaultLocale: true`: no se setea. `Astro.currentLocale` devuelve `'es'` o `'en'` en páginas y componentes. Helpers en `astro:i18n`: `getRelativeLocaleUrl`, `getAbsoluteLocaleUrl`, `getPathByLocale`, `getLocaleByPath`.
- **Imágenes.** `<Image>` y `<Picture>` de `astro:assets`; `priority` para la imagen LCP (pone `loading="eager"`, `fetchpriority="high"` y `decoding="sync"`); `widths` siempre con `sizes`; `formats={['avif', 'webp']}` en `<Picture>`. Los estilos de imágenes responsivas (`layout`) se aplican con atributos `data-astro-*` y una clase con hash, no con `style` inline. `alt` es obligatorio.
- **`site` en `astro.config.mjs`** tiene que ser una URL válida: `https://[DOMINIO]` rompe el build. Se lee de `PUBLIC_SITE_URL` (con `loadEnv` de `vite`) y cae a la URL real del sitio en Netlify, `https://seres-migratorios.netlify.app`, hasta que exista el dominio (SM-010 / SM-064). El placeholder `[DOMINIO]` solo aparece en textos y documentación.
- **Sitemap.** `@astrojs/sitemap@3.7.x` (compatible con zod 4 y Astro 7): `sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-AR', en: 'en-US' } }, filter: (pagina) => ... })`. El `filter` excluye `/kit`, `/gracias` y `/en/thanks`.

## Lo que no cambia

Content Collections con `defineCollection` + `glob` + zod en `src/content.config.ts`; `getCollection`, `getEntry`, `getStaticPaths`; `import.meta.env.PUBLIC_*` para las variables públicas de PLAN §14; `<script>` de vanilla JS en un `.astro` como isla mínima; `output: 'static'` sin adapter.
