---
name: arquitectura-paginas-compartidas
description: Desde Fase 3 (SM-048), el cuerpo de cada página vive en src/components/internos/paginas/*.astro y src/pages/*.astro (ES) + src/pages/en/*.astro son wrappers finos.
metadata:
  type: project
---

Fase 3 ("inglés", rama `fase-3-ingles`) movió el cuerpo de Home, Manifiesto, Apoyar, NoEncontrada, Artistas, Artista, Ediciones y Edicion a plantillas compartidas en `src/components/internos/paginas/*.astro`, más el helper `CuerpoEnPendiente.astro`. Cada página en `src/pages/` (ES) y `src/pages/en/` (EN) es un wrapper de pocas líneas que solo fija `idioma` (y, para rutas dinámicas, resuelve `getStaticPaths` y pasa la entry).

**Por qué**: evita que las dos rutas de idioma diverjan — la gemela EN es literalmente el mismo archivo con `idioma = 'en'` (skill `paginas-bilingues`).

**Cómo aplicar**:
- Nombres como `Home`, `Manifiesto`, `Apoyar`, `NoEncontrada`, `Artistas`, `Artista`, `Ediciones`, `Edicion`, `CuerpoEnPendiente` en `components/internos/paginas/` NO son una violación de "nombres canónicos": son helpers ajenos al DS (CLAUDE.md ya prevé que estos van en `internos/`).
- Al auditar un cambio a una de estas plantillas, comparar contra la página original en `origin/main` con `git diff origin/main:src/pages/<ruta original> HEAD:src/components/internos/paginas/<Plantilla>.astro`. Diffs esperados y no-hallazgo: imports relativos (cambian de profundidad), `interface Props { idioma }`, lecturas `[idioma]` en vez de `.es`, y — donde aplique — el título pasado a `Pagina`/`Base` ahora SIN componer manualmente `separador` + `tituloSitio` (eso lo hace `Seo.astro` internamente vía `tituloCompleto`, así que un `titulo` ya compuesto duplicaría el sufijo).
- `Seo.astro` (SM-050) agregó `hreflang` (`es-AR`/`en-US`/`x-default`) leyendo `rutasAlternativas()` de `i18n/rutas.ts`; no es un hallazgo de diseño, es plumbing de SEO.
- SM-047 (mismo rango de commits) migró placeholders hardcodeados (`'[LINK MERCADO PAGO]'`, `'[EMAIL DEL COLECTIVO]'`) a claves de diccionario (`apoyar.linkMercadoPago`, `pie.contacto.emailPendiente`) para que el placeholder salga en el idioma de la página. Es contenido/i18n (auditor-contenido-bilingue), no diseño.
