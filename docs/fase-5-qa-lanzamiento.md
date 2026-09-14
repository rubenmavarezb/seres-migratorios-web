# Fase 5 — QA y lanzamiento

Base: `origin/main` (`ce2984d`). Rama: `fase-5-qa-lanzamiento`.
Revisión: 12.09.2026.

## SM-065 — Analytics y robots.txt (+ verificación SM-064)

### Implementación

- **Módulo compartido `src/analitica.ts`** (no importa nada, igual que
  `i18n/rutas.ts`, para que `astro.config.mjs` lo lea a nivel de config y
  `node --test` lo corra sin bundler):
  - `RUTAS_EXCLUIDAS_DE_ANALITICA = ['/kit', '/gracias', '/en/thanks']`: única
    fuente de la lista, consumida por el beacon (`Base.astro`), el filtro del
    sitemap (`astro.config.mjs`) y el `Disallow` de `robots.txt`
    (`src/pages/robots.txt.ts`). Antes vivía solo en `astro.config.mjs` como
    `RUTAS_FUERA_DEL_SITEMAP`; se movió y renombró (la instrucción del
    tech lead lo permite explícitamente).
  - `sinBarraFinal()` / `estaExcluidaDeAnalitica()`: normalizan la barra final
    de `build.format: 'directory'` (`/gracias/` → `/gracias`) antes de
    comparar.
  - `tokenDeAnalyticsValido(valor: unknown): valor is string`: rechaza
    `undefined`, string vacío/solo espacios y un placeholder entre corchetes
    (`[TOKEN CLOUDFLARE ANALYTICS]`, el valor real de `.env.example`). Recibe
    `unknown` en vez de `string | undefined` siguiendo la convención ya
    existente de `variablePublica()` (`Pie.astro`, `Nav.astro`, etc.): Vite
    tipa `import.meta.env` con índice `any`, así que el valor se angosta acá
    en vez de esparcir `any` por `Base.astro`.
- **`Base.astro`**: agrega el snippet oficial de Cloudflare Web Analytics
  (`<script is:inline defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token })}>`)
  justo después de `Seo`, condicionado a
  `tokenDeAnalyticsValido(tokenAnalytics) && !estaExcluidaDeAnalitica(ruta)`.
  `is:inline` evita que Astro procese el script como módulo; `JSON.stringify`
  arma el atributo (nunca concatenación). Reutiliza `ruta`, el mismo valor que
  ya alimenta a `Seo`/`Nav`. Se actualizó el comentario de `Base.astro` que
  decía "SM-065 lo agrega después", y el de `Seo.astro` que mencionaba el
  beacon como ausente, para que ahora apunte a dónde vive de verdad.
  `src/pages/kit.astro` también citaba el nombre viejo de la lista
  (`RUTAS_FUERA_DEL_SITEMAP`) en su comentario; se actualizó al nuevo.
- **`src/pages/robots.txt.ts`**: endpoint estático (`GET`), arma `Sitemap:`
  con `new URL('sitemap-index.xml', site)` (nunca dominio hardcodeado) y un
  `Disallow` por cada ruta de `RUTAS_EXCLUIDAS_DE_ANALITICA`. Falla con
  `throw` si `site` es `undefined` (nunca pasa hoy: `astro.config.mjs`
  siempre define un `site`, con o sin `PUBLIC_SITE_URL`). El propio endpoint
  nunca entra a la lista compartida (no debe bloquearse a sí mismo) ni al
  sitemap: `@astrojs/sitemap` solo recolecta páginas `.html`, así que el
  `.txt` no llega ahí.
- **`.env.example`**: se dejó el placeholder intacto; se amplió el comentario
  para explicar que sin un token real no se emite el beacon.
- **Tests unitarios** (`tests/unitarias/analitica.test.mjs`, mismo patrón que
  `rutas.test.mjs`): 23 casos — la lista exacta de rutas excluidas,
  `sinBarraFinal` (raíz, con/sin barra), `estaExcluidaDeAnalitica` (las tres
  rutas con y sin barra final, y seis rutas públicas que NO deben excluirse),
  y `tokenDeAnalyticsValido` (undefined, vacío, solo espacios, placeholder,
  cualquier corchete, no-string, token real con/sin espacios alrededor).

### Verificación local

- `npm run check`: 0 errores, 0 warnings, 4 hints (heredados de `design/`, no
  tocados por esta tarea).
- `npm run lint`: limpio.
- `npm run test:unit`: 129 pruebas, todas pasan (`node` v22.22.0), incluidas
  las 23 nuevas de `analitica.test.mjs`.
- `npx prettier --check .`: limpio (`.env.example` no tiene parser de
  Prettier, así que el comando no lo toca).
- `npm run build`: 47 páginas, sin variables de entorno (estado por defecto):
  - `dist/robots.txt`:
    ```
    User-agent: *
    Allow: /
    Disallow: /kit
    Disallow: /gracias
    Disallow: /en/thanks

    Sitemap: https://seresmigratorios.com/sitemap-index.xml
    ```
  - `grep -rl cloudflareinsights dist` → vacío (sin token real, el HTML no
    cambia respecto de main salvo lo que agrega `robots.txt`).
  - `grep -rl netlify.app dist` → vacío.
  - `dist/sitemap-0.xml` no contiene `/kit`, `/gracias` ni `/en/thanks`; no
    contiene `/robots.txt`.
  - `canonical` / `og:url` de `dist/index.html` → `https://seresmigratorios.com/`.
- Build con `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=prueba123`: el beacon aparece
  en 44 páginas (las 47 menos `/kit`, `/gracias`, `/en/thanks`, verificado
  explícitamente que esos tres NO lo tienen); `data-cf-beacon` sale como
  `data-cf-beacon="{&quot;token&quot;:&quot;prueba123&quot;}"` (Astro escapa
  las comillas del atributo — el navegador las desescapa al leer
  `getAttribute`; un grep literal por `data-cf-beacon='{"token"` no
  encuentra nada por esto, hay que buscar por `cloudflareinsights`).
  Reconstruido después sin token para dejar `dist/` como en `main`.
- Build con `PUBLIC_SITE_URL=` (vacío, forzando el fallback de
  `astro.config.mjs`): canonical y `Sitemap:` de `robots.txt` siguen en
  `https://seresmigratorios.com`; `grep -rl netlify.app dist` vacío.
- Ningún token real se escribió en ningún archivo del repo en ningún momento
  (los builds de prueba usaron la variable de entorno del comando, nunca
  `.env`).
- `npx playwright test`: corre, levanta el preview server y termina con
  "No tests found" — esperado, no un fallo: `tests/e2e/` solo tiene un
  `.gitkeep` hoy (los specs quedaron para SM-059, según su propio
  `playwright.config.ts`), así que esta tarea no tenía ninguna prueba e2e que
  pudiera romper.

### Decisiones

- La lista compartida vive en `src/analitica.ts` (nuevo módulo en `src/`, no
  dentro de `i18n/`: no es una preocupación de traducción) en vez de en
  `astro.config.mjs`; la instrucción del tech lead permitía este movimiento
  explícitamente. `astro.config.mjs` y `Base.astro`/`robots.txt.ts` importan
  la misma constante.
- `robots.txt` usa `Disallow` sin barra final (`/gracias`, no `/gracias/`):
  `Disallow` matchea por prefijo, así que ya cubre la forma con barra que
  emite `build.format: 'directory'`; queda documentado en el propio archivo.

### OBSERVACIÓN

- Tensión `Disallow` / `noindex`: `/gracias`, `/en/thanks` y `/kit` llevan
  `noindex` (`Base.astro`) y ahora también `Disallow` en `robots.txt`. Un
  crawler que respeta `robots.txt` nunca llega a leer el `noindex` de esas
  páginas porque no las visita; en la práctica el `Disallow` ya alcanza para
  mantenerlas fuera de los resultados. Documentado tal cual pide el backlog,
  sin cambiar el comportamiento pedido.
- Sin `integrity`/`crossorigin` en el `<script>` del beacon, a propósito: es
  el snippet oficial de Cloudflare tal cual lo entrega su panel, que no
  publica un hash SRI del archivo (`beacon.min.js` puede rotar de contenido
  del lado de Cloudflare sin previo aviso). Fijar un hash acá rompería el
  beacon en la próxima rotación, sin ganar nada — el dominio ya está
  restringido a `static.cloudflareinsights.com`.

## SM-059 — Smoke tests de Playwright

### Implementación

- **`tests/e2e/*.spec.ts`** (TypeScript estricto, sin `any`):
  - `home.spec.ts`: home ES (`lang="es"`, un solo `<h1>`, canonical exacto
    `https://seresmigratorios.com/`) y home EN (`lang="en"`, el chip `es` del
    selector de idioma —scoped a `<header>`, `exact: true`— apunta a `/` y
    navega ahí).
  - `artistas.spec.ts`: `/artistas` → click en el link del artista con más
    fotos en `obra` (derivado del contenido real, ver `contenido.ts`) → perfil
    con `<h1>` propio; más el gemelo EN (`/en/artists/<slug>`) en un test
    aparte.
  - `ediciones.spec.ts`: `/ediciones` → botón "Ver la edición"/"See the
    edition" (texto leído de `es.json`) → detalle de la única edición real
    (`buenos-aires-2026`). El `<h1>` de esa página es el isotipo "Seres
    Migratorios" del diseño (compartido por todas las ediciones, ver
    OBSERVACIÓN), así que lo que identifica la edición es el `<title>`
    compuesto por `Seo.astro` a partir de `titulo={data.nombre}`.
  - `lightbox.spec.ts`: sobre el mismo perfil con galería — click en la
    primera miniatura (`[data-galeria-foto]`) abre el `<dialog data-lightbox>`,
    `ArrowRight` avanza la diapositiva visible (`data-indice` 0→1), `Escape`
    cierra el diálogo y devuelve el foco a la miniatura que lo abrió.
  - `convocatoria.spec.ts`: dos suites.
    - "cerrada" (corre siempre salvo `CONVOCATORIA_ABIERTA=1`): `/convocatoria`
      y `/en/open-call` sin `<form>` y con el estado cerrado visible
      (`convocatoria.cerrada.caja` del diccionario).
    - "abierta" (título con tag `@abierta`, `test.skip` salvo
      `CONVOCATORIA_ABIERTA=1`): postulación con datos sintéticos, POST
      interceptado con `page.route` (nunca sale a red) hacia `/gracias`/`/en/thanks`,
      verifica el `action` real del `<form>` **y** el `pathname` de la URL del
      POST capturado contra ese mismo destino (QA ronda 1, ver más abajo — sin
      esto el mock podía redirigir a cualquier lado y el test igual pasaba),
      `form-name`, el campo oculto `idioma` y que el POST mockeado
      efectivamente llegó con esos valores; honeypot `bot-field` no
      alcanzable (chequeo determinístico de foco por script + recorrido real
      de 25 `Tab` desde el <header> sin que `bot-field` aparezca nunca como
      `document.activeElement`); y un caso de error accesible con JS
      (`aria-invalid="true"` + resumen `role="alert"` con el texto exacto de
      `formulario.resumen`). Reutiliza los selectores ya probados de
      `scripts/verificar-convocatoria.mjs` (no se tocó ese script).
  - `robots.spec.ts`: `/robots.txt` responde y contiene una línea
    `Sitemap: https://.../sitemap-index.xml`.
  - `contenido.ts`: helpers que leen `src/content/artistas` y
    `src/content/ediciones` con `node:fs` (no `astro:content`, no disponible
    fuera del build) para no hardcodear ni el slug del artista con galería
    (elige el de más fotos en `obra`, hoy `ruben-mavarez` con 8) ni el de la
    edición (la única que existe hoy).
  - `entorno.ts`: `CONVOCATORIA_ABIERTA = process.env.CONVOCATORIA_ABIERTA === '1'`,
    único punto que lee esa variable.
  - `ayudantes.ts`: `sinNetlifyEnMetadatos(page)` — asserta que `canonical` y
    `og:url` nunca contienen `netlify.app` (SM-064); se llama en cada spec que
    visita una página nueva (home ES/EN, `/artistas` índice y perfil ES/EN,
    `/ediciones` índice y detalle, `/convocatoria` y `/en/open-call` cerradas).
  - Se borró `tests/e2e/.gitkeep` (ya sobra).
- **`playwright.config.ts`**: `forbidOnly: !!process.env.CI` (un `.only`
  commiteado no debe pasar en CI, pero tampoco debe romper `npm test` en
  local mientras se depura); `retries: 0` (un smoke test que necesita reintento
  para pasar no es determinístico); `use.reducedMotion: 'reduce'` (las
  entradas por scroll de DS §11 quedarían a mitad de `opacity` si una
  aserción cae dentro de su ventana de animación); `reporter`: `'list'` en
  local, `[['github'], ['html', { open: 'never' }]]` en CI. Comentario de
  cabecera actualizado (ya no dice "los tests llegan en SM-059").
- **`.github/workflows/ci.yml`**, mismo job `ci` (único check requerido):
  después de `npm run build` se agregan, en orden, `npx playwright install
--with-deps chromium`, `npm test` (suite cerrada, contra el build normal),
  un paso que hace `sed` sobre `abierta: false` → `abierta: true` en
  `src/content/convocatorias/edicion-02.md` **y verifica con `grep` que el
  cambio realmente ocurrió** (si el `sed` alguna vez se vuelve un no-op por
  un cambio de formato del frontmatter, este paso falla en vez de dejar que
  la suite `@abierta` se salte en silencio), un segundo `npm run build`, y
  `CONVOCATORIA_ABIERTA=1 npx playwright test --grep @abierta`. Un paso final
  sube `playwright-report/` como artifact solo `if: failure()`. El `sed`
  corre y muta contenido solo en el runner efímero; nada de esto se
  commitea.
- `test-results/` y `playwright-report/` ya estaban en `.gitignore` desde
  SM-007; no hizo falta tocarlo.

### Verificación local

- `npx astro check`: 0 errores, 0 warnings, 4 hints (heredados de `design/`).
- `npm run lint`: limpio.
- `npm run test:unit`: 129 pruebas, todas pasan.
- `npx prettier --check .`: limpio.
- `npm run build`: 47 páginas (estado cerrado).
- Suite cerrada: `npx playwright test` → **9 passed, 6 skipped** (los 6
  `@abierta`), 0 failed.
- Variante abierta: `sed` a `abierta: true` en
  `src/content/convocatorias/edicion-02.md` → `npm run build` → `CONVOCATORIA_ABIERTA=1
npx playwright test --grep @abierta` → **6 passed**. Con el mismo build
  abierto, `npx playwright test convocatoria.spec.ts` (sin `--grep`) confirma
  la guarda simétrica: la suite "cerrada" se salta (2 skipped) y la
  "abierta" sigue en verde (6 passed) — así CI-paso-1 (build cerrado, sin
  `--grep`) nunca ejecuta de verdad los `@abierta`, y CI-paso-2 nunca vuelve a
  correr los de estado cerrado contra el build abierto. Se restauró el
  archivo (`git diff src/content/convocatorias/edicion-02.md` → vacío) y se
  reconstruyó en estado cerrado antes de reportar.
- **Controles negativos** (rotos a propósito, corridos, confirmado el fallo,
  revertidos — no quedan en el código):
  1. Canonical de home ES cambiado a un dominio inventado →
     `expect(locator).toHaveAttribute(expected) failed … Received:
"https://seresmigratorios.com/"`.
  2. Aserción de foco del lightbox invertida a `.not.toBeFocused()` →
     `expect(locator).not.toBeFocused() failed … Received: "focused"`.
  3. `toHaveCount(0)` del `<form>` en estado cerrado cambiado a
     `toHaveCount(1)` → falla en **ambos** idiomas (`/convocatoria` y
     `/en/open-call`) con `Received: 0`.
  4. Ver también la sección "SM-059 — QA ronda 1" más abajo: control
     negativo del `action` del formulario de postulación, agregado en esa
     ronda (no en la implementación inicial).

### Decisiones

- El artista de la galería y la edición del test no se hardcodean: se derivan
  del contenido real vía `tests/e2e/contenido.ts` (CLAUDE.md, "no inventar
  datos" aplicado también a los fixtures de test). Hoy resuelve a
  `ruben-mavarez` (8 fotos) y `buenos-aires-2026` (única edición), pero el
  spec sigue funcionando si el contenido cambia.
- Import de `es.json`/`en.json` en los specs con `with { type: 'json' }`:
  necesario porque Playwright corre los specs con el loader ESM nativo de
  Node (no con Vite, que no lo exige); `src/i18n/utils.ts` no lo necesita
  porque a ese archivo lo procesa el bundler de Astro.
- El honeypot se verifica con dos mecanismos (foco por script + recorrido
  real de `Tab`) en vez de solo leer los atributos `hidden`/`tabindex="-1"`:
  la inaccesibilidad por Tab es justamente lo que hay que ejercitar, no solo
  inferir de los atributos.

### OBSERVACIÓN

- **`astro preview` y agentes de IA**: Astro 7.3.1 detecta (`am-i-vibing`) si
  el proceso corre dentro de un agente de codificación y, en ese caso,
  arranca el preview server **en segundo plano** aunque no se pase
  `--background` — el comando vuelve al instante mientras el servidor real
  sigue vivo como proceso desacoplado. Eso rompe el mecanismo `webServer` de
  Playwright, que espera que el comando se quede en foreground hasta que él
  mismo lo mate: falla con "Process from config.webServer exited early". El
  detector es específico de agentes de codificación (`am-i-vibing`), no de CI
  genérico, así que no dispara en GitHub Actions — pero si alguien corre
  `npx playwright test` a mano dentro de un agente (como esta misma tarea),
  hace falta `ASTRO_PREVIEW_BACKGROUND=1 npx playwright test` (o `npx astro
preview stop` si queda un daemon colgado de un intento anterior) para que
  el preview se quede en foreground. No se tocó `playwright.config.ts` para
  esto porque el problema no existe en CI; queda documentado acá para quien
  vuelva a correr la suite a mano desde un agente.
- El `<h1>` de `/ediciones/[slug]` es el isotipo "Seres Migratorios" del
  diseño aprobado (`Edicion.dc.html`), no el nombre de la edición — igual en
  ambas ediciones que llegue a haber. El spec de `ediciones.spec.ts` verifica
  el nombre en el `<title>` en vez de en el `<h1>` por esto.

## SM-059 — QA ronda 1: hallazgo bloqueante corregido

### Hallazgo

El test `${ruta}: postulación mockeada llega a ${gracias}` era circular: el
mock de `page.route` intercepta **todos** los POST y responde con un 303 cuyo
`location` es `${gracias}/`, fijado por el propio test — la
`page.waitForURL` posterior sólo comprobaba esa redirección auto-inyectada.
Ni el `action` del `<form>` ni la URL real del POST capturado
(`solicitudPost`) se comparaban contra `gracias`, así que el test pasaba
igual con el `action` correcto que con uno apuntando al gemelo de idioma
equivocado (regresión de `rutaLocalizada`) — exactamente lo que CLAUDE.md
exige (`action="/gracias"` ES, `action="/en/thanks"` EN) quedaba sin cubrir.

### Corrección

En `tests/e2e/convocatoria.spec.ts`, dentro del test de postulación mockeada:

- Se agregó `await expect(form).toHaveAttribute('action', gracias)` antes de
  instalar el mock — comprueba el destino real que el producto declara.
- Se agregó `expect(new URL(solicitudPost!.url()).pathname).toBe(gracias)`
  después de capturar el POST — comprueba a qué URL efectivamente se
  submiteó el formulario (no sólo que la respuesta mockeada redirigió ahí).

No se tocó nada del diseño de la suite (mocking, tags `@abierta`, guarda por
`CONVOCATORIA_ABIERTA`): el resto del hallazgo original queda vigente tal
como estaba.

### Verificación

- Control negativo (el escenario exacto del hallazgo): con
  `abierta: true` + `npm run build`, se editó a mano
  `dist/convocatoria/index.html` cambiando `action="/gracias"` por
  `action="/en/thanks"` (form ES apuntando al gemelo EN) y se corrió
  `CONVOCATORIA_ABIERTA=1 npx playwright test --grep "@abierta.*postulación mockeada llega a /gracias"`
  contra ese build mutado → **falla** en la nueva aserción:
  `Expected: "/gracias" … Received: "/en/thanks"`. Se restauró el HTML
  mutado (era una copia en `dist/`, nunca se tocó el contenido fuente) y se
  re-corrió: **verde**.
- `CONVOCATORIA_ABIERTA=1 npx playwright test --grep @abierta` (build
  correcto, `abierta: true`): **6 passed**.
- Se restauró `src/content/convocatorias/edicion-02.md` a `abierta: false`
  (`git diff` del archivo → vacío) y se reconstruyó.
- `npm run build` (estado cerrado): 47 páginas.
- `npx playwright test` (suite completa, estado cerrado): **9 passed, 6
  skipped** (los `@abierta`), 0 failed.
- `npx astro check`: 0 errores, 0 warnings, 4 hints (heredados de `design/`).
- `npm run lint`: limpio.
- `npm run test:unit`: 129 pruebas, todas pasan.
- `npx prettier --check tests/e2e/convocatoria.spec.ts`: limpio.

### OBSERVACIONES

- El hallazgo bloqueante era correcto (el reporte de QA ya incluía evidencia
  de que el test original, sin las dos aserciones nuevas, pasaba igual
  contra un build con el `action` mutado). El control negativo de esta
  ronda reproduce ese mismo escenario contra el test **ya corregido** y
  confirma que ahora discrimina: falla con el `action` equivocado, pasa con
  el correcto.
- No se tocó ningún otro archivo de esta tarea (playwright.config.ts,
  ci.yml, el resto de los specs): el hallazgo estaba acotado a
  `convocatoria.spec.ts` y la corrección se mantuvo mínima.

## Medición de base

Medida en el commit `c680865` (rama `fase-5-qa-lanzamiento`, HEAD tras
SM-059 "orden estable de ediciones"), antes de aplicar las tres líneas de
la ronda 2 (SM-061, SM-060, SM-063). El repo no se tocó: `git status
--short` dio limpio antes y después.

**Método**: `npm run build` (Astro 7.3.1, 47 páginas) servido por un
servidor estático propio en Node —no `astro preview`, evita el problema de
detección de agentes (`am-i-vibing`) documentado en la OBSERVACIÓN de
SM-059— en `127.0.0.1:4517`, con gzip para tipos de texto y cache
`immutable` para `/_astro/`, igual que Netlify. Lighthouse CLI 13.0.3 con
el Chrome del sistema (headless), preset mobile por defecto (412×823,
throttling simulado), 3 corridas por ruta repartidas en 3 vueltas, mediana
por separado para cada categoría y cada métrica (LCP, CLS, TBT). La 404 se
midió en `/404` servida con 200 porque Lighthouse aborta ante un 404 real
(`ERRORED_DOCUMENT_REQUEST`). Peso = HTML de la ruta + CSS/JS local
referenciado, cada uno comprimido por separado con gzip nivel 9 (mismo
cálculo que `npm run test:peso`). axe con `scripts/capturas-axe.mjs`
(etiquetas wcag2a/2aa/21a/21aa) en 1440 y 390 px sobre las rutas ES/EN
equivalentes; `/convocatoria/` y `/en/open-call/` se auditaron en estado
cerrado (sin `<form>`, la convocatoria 02 estaba `abierta: false`). Control
aparte, solo de rendimiento, bloqueando `fonts.googleapis.com`/
`fonts.gstatic.com` en `/artistas/`, `/en/` y `/404`. Máquina con carga de
6.1 a 11.5 durante las 30 corridas.

| Ruta                            | Rend.  | Accesib. | B. Prácticas | SEO | LCP     | CLS    | TBT  | Peso gzip | axe |
| ------------------------------- | ------ | -------- | ------------ | --- | ------- | ------ | ---- | --------- | --- |
| `/`                             | 99     | 100      | 100          | 100 | 1932 ms | 0.0049 | 0 ms | 15.4 KB   | 0   |
| `/manifiesto/`                  | 95     | 100      | 100          | 100 | 2468 ms | 0.0011 | 0 ms | 13.5 KB   | 0   |
| `/artistas/`                    | **92** | 100      | 100          | 100 | 2770 ms | 0.0006 | 0 ms | 13.4 KB   | 0   |
| `/artistas/herick-frontado/`    | 99     | 100      | 96           | 100 | 1726 ms | 0.0017 | 0 ms | 14.2 KB   | 0   |
| `/ediciones/`                   | 99     | 100      | 100          | 100 | 1766 ms | 0.0016 | 0 ms | 12.8 KB   | 0   |
| `/ediciones/buenos-aires-2026/` | 95     | 100      | 100          | 100 | 2863 ms | 0.0036 | 0 ms | 17.3 KB   | 0   |
| `/convocatoria/`                | 95     | 100      | 100          | 100 | 2498 ms | 0.0009 | 0 ms | 13.4 KB   | 0   |
| `/apoyar/`                      | 99     | 100      | 100          | 100 | 1749 ms | 0.0008 | 0 ms | 13.2 KB   | 0   |
| `/404`                          | **92** | 100      | 100          | 69  | 2842 ms | 0.0024 | 0 ms | 12.4 KB   | 0   |
| `/en/`                          | **91** | 100      | 100          | 100 | 2859 ms | 0.0039 | 0 ms | 15.0 KB   | 0   |

Tres rutas por debajo del umbral de 95 en rendimiento: `/artistas/` (92),
`/404` (92, SEO 69 explicado por el `noindex` deliberado) y `/en/` (91).
El diagnóstico atribuyó la caída a la cadena de 4 saltos de Google Fonts
(`@import` en `Base.css` → CSS de `fonts.googleapis.com` → 4 woff2 de
`fonts.gstatic.com`), confirmado con el control de rutas sin fuentes
externas (99/99/99 estable). CLS ≤ 0.0049 y TBT 0 ms en las 10 rutas; axe
sin violaciones en las 36 páginas auditadas (18 rutas × 2 anchos).

## SM-061 — presupuesto de peso ≤ 120 KB verificado en CI (ronda 2, corrección de QA)

**Bloqueante de ronda 1 corregido**: "Tests unitarios que fallan si se rompe el gate" — los tests no cubrían la decisión real del gate (umbral, unidad, exit 1).

### Qué se hizo

1. **Extraída la decisión pura del gate.** `scripts/presupuesto-peso.mjs` ahora exporta `evaluarPresupuesto(resultados) -> { queExceden, conReferenciasRotas, ok }`: toma los resultados por página y decide, sin tocar `process` ni consola, cuáles exceden el presupuesto gzip y cuáles tienen una referencia local rota, y si el run pasa. `main()` llama a esta función en vez de recalcular los mismos dos filtros inline, y su único punto de salida (`process.exitCode = 1`) ahora depende de `!ok`.

2. **Reescrito el test tautológico.** El test "flags a page whose HTML+CSS exceeds the 120 KB gzip budget" armaba el fixture con `LIMITE_BYTES + 4096` y afirmaba `gzipBytes > LIMITE_BYTES` — ambos lados dependían de la misma constante importada, así que pasaba con cualquier umbral. Ahora el fixture usa un tamaño absoluto fijo (`122880 + 4096` bytes, escrito literal, no derivado del import) y el assert compara contra el literal `122880`.

3. **Agregado un test que fija los tres literales del presupuesto**: `LIMITE_KB === 120`, `LIMITE_BYTES === 122880`, `NIVEL_GZIP === 9`, contra números escritos a mano, no unos contra otros.

4. **Agregados 4 tests de `evaluarPresupuesto`** con objetos `PesoDePagina` sintéticos (sin pasar por `calcularPesoDePagina` ni por disco): página sana (ok=true), página que excede en gzip por 1 byte sobre 122880 (con `brutoBytes` deliberadamente chico y desacoplado de `gzipBytes`, para que el test detecte específicamente si la comparación usara `brutoBytes` por error), página justo en el límite (no excede — `>`, no `>=`), y página con referencia rota (falla aunque el peso esté bien).

5. **Agregados 3 tests de `generarTabla`**: orden descendente por gzip sin importar el orden de entrada, la línea `Máximo:` nombrando la página más pesada, la marca `⚠ EXCEDE` en la fila que corresponde y ausente en la que no, y el caso de lista vacía. No estaban pedidos explícitamente en el hallazgo, pero cierran un mutante de la matriz de ronda 1 ("tabla ordenada ascendente: SURVIVED") que entra dentro del alcance de la decisión 1 del tech lead ("salida legible con tabla ordenada por peso y el máximo").

6. **Agregados 3 tests de integración end-to-end vía `spawnSync`** que corren el CLI real (`node scripts/presupuesto-peso.mjs <dist-fixture>`) contra tres `dist/` de `mkdtemp`: exit 0 con una página sana, exit 1 con una página que excede el presupuesto gzip, exit 1 con una referencia local rota. Estos son los tests que faltaban por completo en ronda 1 — nada llamaba antes a `main()` ni ejercitaba el exit code real del proceso.

### Cómo se verificó

- `node --test tests/unitarias/presupuesto-peso.test.mjs`: 23 tests, 23 pass (antes de agregar los de `generarTabla`; con ellos, 152/152 en toda la suite `test:unit`).
- **Re-corrí manualmente el mismo estilo de mutation testing que usó QA** (copias del árbol en `/private/tmp/claude-501/`, nunca en el worktree; mutando el script con `node -e` y corriendo `node --test`) contra los mutantes que la ronda 1 reportó como sobrevivientes:
  - `LIMITE_KB = 1200`: **killed** (17 pass / 3 fail; antes 12/0, sobrevivía).
  - `if (!ok) { process.exitCode = 1 }` removido de `main()`: **killed** (18/2).
  - Guard del CLI forzado a `if (false)` (nunca corre `main()`): **killed** (17/3).
  - Orden de `generarTabla` invertido a ascendente: **killed** (22/1).
  - `LIMITE_BYTES = KB * 1000`: razonado, no re-ejecutado — cae directamente del test de constantes pinneadas (`122880 !== 120000`) y del test de `evaluarPresupuesto` en el límite (`122880` no comparado como `120000`).
  - "main mide bruto en vez de gzip": no aplica directamente a `main()` (esa lógica vive en `evaluarPresupuesto` ahora); probé el equivalente ahí — `evaluarPresupuesto` comparando `r.brutoBytes` en vez de `r.gzipBytes` — que en un primer intento (fixture con `brutoBytes == gzipBytes`) **sobrevivió** (20/0), y quedó **killed** (19/1) tras desacoplar `brutoBytes` de `gzipBytes` en ese fixture.
- Gate completo, en el worktree, de punta a punta:
  - `npm run check`: 0 errores, 0 warnings (4 hints en `design/`, fuera de build).
  - `npm run lint`: limpio.
  - `npm run test:unit`: 152/152.
  - `npx prettier --check .` (repo completo): limpio.
  - `npm run build`: 47 páginas.
  - `npm run test:peso` contra ese build real: **OK — 47 páginas, todas ≤ 120.0 KB gzip**; máximo `kit/index.html` en 18.9 KB gzip (118.0 KB bruto).
  - `ASTRO_PREVIEW_BACKGROUND=1 npx playwright test`: 9 passed, 6 skipped (los `@abierta`, esperado con la convocatoria 02 cerrada).
  - `npx astro preview stop`: sin daemon colgado.
  - `git status --short`: solo los 4 archivos de mi propiedad.

### Decisiones

- El fixture de "excede presupuesto" (tanto en el test unitario de `calcularPesoDePagina` como en el de CLI) usa un tamaño absoluto escrito a mano (122880+4096 bytes), no `LIMITE_BYTES + 4096`, para que no escale junto con una constante mutada.
- Los tests de `evaluarPresupuesto` usan objetos `PesoDePagina` sintéticos en vez de pasar por `calcularPesoDePagina`/disco: permiten fijar `gzipBytes` exactamente en el borde (122880 y 122881) sin depender de que un contenido real gzipee a un tamaño exacto.

### OBSERVACIONES

- No inventé datos ni tomé decisiones fuera de mi propiedad; el único cambio de comportamiento en `scripts/presupuesto-peso.mjs` es la extracción de `evaluarPresupuesto` (refactor puro, mismo comportamiento observable de `main()`).
- Detecté y corregí yo mismo, antes de reportar, que mi primer test de `evaluarPresupuesto` contra el literal 122880 no mataba el mutante "compara brutoBytes en vez de gzipBytes" (fixture con ambos campos iguales); quedó resuelto fijando `brutoBytes` en un valor chico y desacoplado.
- La página más pesada del build real es `kit/index.html` (118.0 KB bruto / 18.9 KB gzip) — no es ninguna de las 10 rutas que cubrió la medición manual de Lighthouse/peso del baseline. Está al 98% del límite en bruto pero solo al 16% en gzip: el modo elegido (gzip, decisión 2 del tech lead) es lo que la hace pasar hoy; una página futura podría superar 120 KB en bruto y seguir pasando el gate en gzip. Es una nota de transparencia sobre el modo ya decidido, no un pedido de cambiarlo.
- `.github/workflows/ci.yml` completo (no solo el diff) tiene un solo `npm run build` antes de mi paso `test:peso`, tal como pide la spec. Hay un segundo `npm run build` más abajo (paso SM-059, convocatoria abierta para los specs `@abierta`) que no vuelve a pasar por el gate de peso — el presupuesto solo se verifica sobre el build con la convocatoria cerrada (contenido committeado).

## SM-060 — auditoría de accesibilidad y contraste (ronda 2, corrección de bloqueantes)

Corrección de los 3 bloqueantes de la ronda 1 de QA, en el worktree `fase-5-accesibilidad`. El repo no se tocó fuera de mi propiedad; no hubo commit.

### Bloqueante 1 — fuga de foco en el menú móvil (Nav.astro)

QA reprodujo, con teclado real a 390px, que tras `@seresmigratorios` (el último control enfocable del `<dialog>` del menú) el siguiente Tab caía en `document.body` por una parada antes de volver a entrar al menú — la misma fuga de `showModal()` que ya se había identificado y corregido en `Lightbox.astro`, pero no en `Nav.astro`, que es de esta propiedad y que el criterio del backlog nombra explícitamente ("navegación completa por teclado ... en nav").

**Reproducción del fallo antes del fix:** se agregaron dos tests nuevos a `teclado.spec.ts` (`menú móvil`) que recorren con `page.keyboard.press` real el límite hacia adelante (Tab tras `@seresmigratorios`) y hacia atrás (Shift+Tab desde el chip "en"), verificando en cada paso que `document.activeElement?.closest('#menu') !== null`. Corridos contra el `Nav.astro` sin arreglar (tras `npm run build` para asegurar que `dist/` reflejara el estado actual — `astro preview` sirve el build, no reconstruye), ambos fallaron exactamente con "salió del menú móvil (a body)", reproduciendo la fuga que reportó QA.

**Fix:** se agregó a `Nav.astro` el mismo patrón de `Lightbox.astro` — un listener de `keydown` en el `<dialog>` que envuelve Tab/Shift+Tab en el límite —, pero consultando los controles en vivo con `dialogo.querySelectorAll('a[href]')` (los 8 focusables del menú son todos `<a>`) en lugar de una lista fija de 3 selectores como en Lightbox: el conjunto solo crece si se agrega un idioma, así el fix no necesita tocarse si eso pasa. Reconstruido el build, los mismos dos tests pasan.

**Límite del fix (para que quede explícito, no implícito):** el menú sin JavaScript (`#menu:target`, el mecanismo que existe para que el sitio funcione sin JS) no tiene ningún trap de foco — no es un `<dialog>` modal, es un panel pintado por CSS puro sobre un documento que sigue siendo completamente navegable con Tab. No hay JS para interceptar nada en ese modo, así que esto queda fuera de lo que este fix puede cubrir.

Se sumó además una captura del paso del wrap (`/private/tmp/claude-501/fase5-a11y/14a-menu-ultimo-control-instagram-foco.png` y `14b-menu-wrap-vuelve-a-chip-en.png`) al recorrido manual de la decisión 3, confirmando visualmente el outline azul-sello en el chip "EN" tras el wrap.

### Bloqueante 2 — comentarios en español en los specs nuevos

Los únicos comentarios de código en español eran `accesibilidad.spec.ts:76-77` y `teclado.spec.ts:56-58`; se tradujeron al inglés. No se tocaron los títulos de test ni los mensajes de aserción en español (`test('...')`, segundo argumento de `expect`): CLAUDE.md acota la regla de "comentarios en inglés" a comentarios/JSDoc, y el precedente ya commiteado en HEAD (`contenido.ts` y este mismo `ayudantes.ts` de SM-059, con mensajes como `throw new Error('Ningún artista publicado...')`) deja esos strings en español — traducirlos habría sido scope creep no pedido por el bloqueante.

### Bloqueante 3 — falta de prueba sobre el handle placeholder de Artistas.astro

El fix de contraste de `CLASE_HANDLE_PLACEHOLDER` (agregado en ronda 1) no tenía ninguna aserción propia: el test de hover solo leía `nth(0)` (número) y `nth(3)` (rol), nunca `nth(2)` (el handle).

Se agregó `artistaConHandlePendiente()` a `tests/e2e/ayudantes.ts` (lee `src/content/artistas/*.md` y devuelve el primer artista cuyo `instagram` matchea `/^\[[^\]]+\]$/`, sin hardcodear el slug — mismo patrón que `contenido.ts`'s `artistaConGaleria()`, pero puesto en `ayudantes.ts` porque la lista de propiedad de esta tarea nombra ese archivo explícitamente para helpers nuevos, no `contenido.ts`) y un test nuevo en `accesibilidad.spec.ts` que ubica esa fila por `[data-fila-artista][href*=slug]`, la hoverea y verifica AA sobre `nth(2)`.

**Reproducción del fallo antes del fix:** se revirtió temporalmente `CLASE_HANDLE_PLACEHOLDER` a `'text-grafito'` (sin el `group-hover:text-tinta-suave`), se reconstruyó el build y se corrió el test nuevo: falló con "ratio 4.42:1, mínimo AA 4.5:1" — el mismo ratio que ya medían número/rol antes de su propio fix, confirmando que el placeholder de handle necesitaba la misma corrección y la misma prueba. Se restauró el archivo (`git diff` volvió a su estado de ronda 1, sin `.bak` residual) y se reconstruyó; el test pasa.

### Gate final (worktree, sin commit)

- `npx astro check` → 0 errors, 0 warnings (105 files; 4 hints son de `design/`, fuera de propiedad).
- `npm run lint` → limpio.
- `npm run test:unit` → 129/129 pass.
- `npx prettier --write` (solo archivos tocados) + `npx prettier --check .` → "All matched files use Prettier code style!".
- `npm run build` → 47 páginas, sin errores.
- `ASTRO_PREVIEW_BACKGROUND=1 npx playwright test` (suite completa) → 59 passed, 11 skipped (los 3 bloques `@abierta`, correctamente no ejecutados sin `CONVOCATORIA_ABIERTA=1`).
- Servidor de preview detenido (`npx astro preview stop`), puertos 4321 y 4399 libres.
- `git status --short` final: solo los 7 archivos de mi propiedad (`Campo.astro`, `Nav.astro`, `Lightbox.astro`, `Artistas.astro`, `ayudantes.ts`, `accesibilidad.spec.ts`, `teclado.spec.ts`). Sin commit.

## SM-063 — Carga de fuentes y rendimiento móvil ≥ 95 (línea `wt/fase-5-rendimiento`)

**Peso propio:** `astro.config.mjs`, `src/layouts/Base.astro`, `src/styles/global.css`, `src/styles/theme.css`, y (solo props de carga de imagen) `src/components/internos/paginas/Home.astro`. Sin commit — worktree `/Users/ruben/Documentos/seres-migratorios-wt/fase-5-rendimiento`, rama `wt/fase-5-rendimiento` sobre `fase-5-qa-lanzamiento`.

### Qué se hizo

**1) Self-host de fuentes, sin dependencia nueva.** La base (SM-063 evidence) mostró que Anton/Courier Prime/Gochi Hand llegaban por un `@import url(fonts.googleapis.com/...)` al tope de `global.css`, formando una cadena crítica de 4 saltos (Documento → Base.css → CSS de Google → woff2 de gstatic) que Lighthouse marcaba con render-blocking-insight=0 (800-870 ms perdidos por ruta) y explicaba por qué `/artistas/`, `/404` y `/en/` caían de 99 a 89-92.

Se migró a la **Fonts API estable de Astro 7** (`fonts` en `astro.config.mjs`, `fontProviders.google()` — estable desde v6.0.0, sin `experimental`, verificado antes de escribir el config con `Object.keys(await import('astro/config'))`). Los archivos se descargan y auto-hostean en build; `<Font cssVariable="...">` (`astro:assets`) en `Base.astro` emite el `@font-face` real en el `<head>` de cada página (Base es el único layout de todo el sitio — verificado recorriendo qué archivo importa a quién).

Pesos/estilos exactos, verificados con grep antes de escribir el config (nada que ninguna página use):

- Anton 400 (único peso que sirve Google; solo se usa sin estilizar).
- Courier Prime 400 y 700 normal — 700 es real (`font-bold` en `.boton`/`.campo` de theme.css, y el `<text class="font-bold">` del SVG de `Sello`). **0 usos de `italic`** en todo el repo (componentes, contenido, CSS), aunque la URL vieja de Google pedía `ital,wght@0,400;0,700;1,400` — ese peso italic era muerto, nunca se había recortado.
- Gochi Hand 400 (running text vía `Anotacion.astro`, sitewide).

Resultado en `dist/`: 0 referencias a `fonts.googleapis.com`/`fonts.gstatic.com`, 4 archivos `.woff2` (antes había más, por subconjuntos duplicados de Google + el italic muerto).

**2) Hallazgo no anticipado: `optimizedFallbacks` (default `true`) viola la regla anti-Arial.** El plan original era `fallbacks: ['sans-serif' | 'monospace' | 'cursive']` confiando en que Astro optimiza métricas (`size-adjust`/`ascent-override`) contra ese genérico. Al construir con el default se inspeccionó el HTML compilado y apareció `@font-face{font-family:"Anton-… fallback: Arial";src:local("Arial")}` y el equivalente con `local("Courier New")` — Astro resuelve el genérico a un **donante real e instalado**, no a un genérico abstracto. Esto choca directo con la instrucción del ticket ("nunca Arial/Helvetica/Roboto/Inter como fallback visible... sobre una local() genérica"). Se agregó `optimizedFallbacks: false` a las 3 familias: el fallback queda en el genérico puro (`sans-serif`/`monospace`/`cursive`), sin `@font-face` ni `local()` adicional. Verificado con grep que `local("Arial"|"Courier New"|...)` desaparece del build.

Costo medido: el CLS sube en las 6 rutas medidas (de ~0.0007–0.0038 a ~0.0007–0.0251), porque ya no hay ajuste métrico del fallback. Sigue muy por debajo del presupuesto de 0.1 (peor caso `/404`: 0.025, ~4× de margen) y no afectó el score de rendimiento (todas las rutas ≥98 igual). Documentado como decisión explícita en `astro.config.mjs` y `theme.css`, con el trade-off para que Rubén decida si prefiere revertir esta única línea.

**3) LCP real de la home en móvil.** La base marcaba la foto hero de `Home.astro` (línea ~327, visible solo en mobile, `md:hidden`) como LCP con `loading="lazy"` sin `fetchpriority`. La foto de fondo desktop (línea ~263, `hidden md:block`) sí tenía `priority` — pero en el viewport móvil que Lighthouse mide, esa foto está en `display:none` y aun así se descargaba eager (CSS no detiene un `loading="eager"`). Se intercambió: `priority` pasa a la foto mobile (la real LCP) y sale de la de fondo desktop (ahora lazy, como su gemela `heroObra2`). Verificado en el HTML: el `<img>` mobile queda con `loading="eager" fetchpriority="high"`.

**4) `theme.css`: tokens de familia.** `--font-display`/`--font-mono`/`--font-manuscrita` pasan de listar la fuente + fallback literal a referenciar `var(--font-astro-*)`. Ver OBSERVACIÓN 1 con el diff completo — la familia de diseño no cambia, solo el fallback deja de nombrar Arial/Impact/Courier New/Comic Sans MS.

### Verificación (resultados reales)

- `grep` build-time: 0 `fonts.googleapis.com`/`gstatic.com`, 0 `local("Arial"|"Helvetica"|"Roboto"|"Inter"|"Courier New"|"Comic Sans"|"Impact")`, 4 `.woff2`.
- Navegador (Playwright/Chrome): `getComputedStyle(h1).fontFamily` → `"Anton-<hash>, sans-serif"`; `body` → `"Courier Prime-<hash>", monospace`; `document.fonts` tras `fonts.ready` → exactamente 4 fuentes cargadas, ninguna italic.
- Capturas 1440/390 de home antes/después: 390px con **hash MD5 idéntico**; 1440px con diff de píxeles confinado exactamente al bounding box de la foto de fondo desktop (x:0-300, y:336-707) — cero diferencia en tipografía o cualquier otro elemento. Enviadas al usuario.
- Lighthouse móvil, mediana de 3, misma sesión (servidores propios en 4611/4612, Chrome 153.0.8010.36 — mismo binario que la base). Máquina compartida con las otras 2 líneas de Fase 5: carga entre 6 y 70 durante la corrida (declarado, `cargas.log`). Antes/después:

| Ruta                            | Rendimiento  | LCP (mediana)  | CLS (mediana)   | Accesibilidad | B. Prácticas | SEO                                          |
| ------------------------------- | ------------ | -------------- | --------------- | ------------- | ------------ | -------------------------------------------- |
| `/`                             | 99 → 99      | 1724 → 2178 ms | 0.0038 → 0.0100 | 100 → 100     | 100 → 100    | 100 → 100                                    |
| `/manifiesto/`                  | 95 → **100** | 2491 → 1427 ms | 0.0011 → 0.0016 | 100           | 100          | 100                                          |
| `/ediciones/buenos-aires-2026/` | 95 → **97**  | 2853 → 2479 ms | 0.0038 → 0.0163 | 100           | 100          | 100                                          |
| `/artistas/`                    | 99 → **100** | 1707 → 1428 ms | 0.0007 → 0.0017 | 100           | 100          | 100                                          |
| `/en/`                          | 99 → 99      | 1754 → 2180 ms | 0.0038 → 0.0101 | 100           | 100          | 100                                          |
| `/404`                          | 92 → **98**  | 2864 → 2253 ms | 0.0038 → 0.0251 | 100           | 100          | 69 → 69 (noindex, ya documentado en la base) |

Las 6 rutas quedan **≥95 en rendimiento** (criterio de SM-061 para estas plantillas). Ver OBSERVACIÓN 4 sobre por qué el LCP en ms de home varía entre corridas sin afectar el score (ruido del simulador de Lighthouse bajo carga de máquina variable, ya documentado como fenómeno abierto en la medición base).

### Gate (worktree propio)

`npx astro check` (0 errores) · `npm run lint` (limpio) · `npm run test:unit` (i18n-paridad OK, texto-hardcodeado OK, 129/129 tests) · `npx prettier --check .` (limpio) · `npm run build` (47 páginas) · `ASTRO_PREVIEW_BACKGROUND=1 npx playwright test` (9 passed, 6 skipped por `@abierta`, esperado — no depende de este cambio).

`git status --short`: exactamente los 5 archivos permitidos.

### OBSERVACIONES para Rubén

Ver el array `observaciones` de este reporte (diff exacto de tokens en `theme.css`, el hallazgo de `local("Arial")` con el default de `optimizedFallbacks`, el trade-off de CLS, y el intercambio de `priority` en el hero de Home).

### Bloqueos (no aplicados, fuera de mi scope)

`Escudo.astro` (LCP de `/ediciones/<slug>/`) y `Sello.astro` (LCP de `/404`) son componentes canónicos sin prop de carga de imagen. Diff exacto propuesto para cada uno en el array `bloqueos` de este reporte. Ninguno bloquea el gate de este ticket: `/404` ya pasa ≥95 (98 medido) y `/ediciones/buenos-aires-2026/` también (97 medido) solo con el arreglo de fuentes.

### Evidencia cruda

`/private/tmp/claude-501/fase5-lh/rendimiento/` (36 reportes Lighthouse, `resumen.json` con medianas, `progreso.log`, `cargas.log`, `dist-antes/`, `dist-despues/`, scripts). `/private/tmp/claude-501/fase5-perf/` (capturas 1440/390 antes/después + diffs de píxeles).

## Integración

Cherry-pick de las tres líneas de ronda 2 sobre `fase-5-qa-lanzamiento` (base `c680865`), en el worktree `fase-5`.

**Commits integrados:**

1. `fe43b5f` — SM-061: presupuesto de peso ≤ 120 KB verificado en CI (cherry-pick de `5ca7118`, `wt/fase-5-presupuesto`)
2. `11f65f7` — SM-060: auditoría de accesibilidad y contraste (cherry-pick de `11242a5`, `wt/fase-5-accesibilidad`)
3. `d99acff` — SM-063: carga de fuentes y rendimiento móvil ≥ 95 (cherry-pick de `f2c178b`, `wt/fase-5-rendimiento`)

Sin conflictos en ninguno de los tres cherry-picks.

**Gate de integración:**

| Comando                                                                                 | Resultado                                                                                                                                               |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git status --short` (antes de integrar)                                                | Limpio; rama `fase-5-qa-lanzamiento` en `c680865`; remote `github-personal`, identidad `rubennmavarezb@gmail.com`                                       |
| `git cherry-pick fase-5-qa-lanzamiento..wt/fase-5-presupuesto`                          | OK sin conflictos, 1 commit (`fe43b5f`). `package.json` solo suma el script `test:peso`, ninguna dependencia nueva                                      |
| `npm run build && npm run test:peso` (medición base, solo con presupuesto aplicado)     | OK: 47 páginas; máximo `kit/index.html` 18.9 KB gzip de 120 KB                                                                                          |
| `git cherry-pick fase-5-qa-lanzamiento..wt/fase-5-accesibilidad`                        | OK sin conflictos, 1 commit (`11f65f7`). `ayudantes.ts` solo agrega exports, no cambia ninguna firma existente                                          |
| `git cherry-pick fase-5-qa-lanzamiento..wt/fase-5-rendimiento`                          | OK sin conflictos, 1 commit (`d99acff`). `theme.css` solo cambia los tokens de fuente a `var(--font-astro-*)`; ningún token de color tocado             |
| `npm run check`                                                                         | OK: 107 archivos, 0 errores, 0 warnings, 4 hints                                                                                                        |
| `npm run lint`                                                                          | OK: eslint limpio                                                                                                                                       |
| `npm run test:unit`                                                                     | OK: i18n-paridad 213 claves; texto-hardcodeado 53 `.astro` OK; `node --test` 152 pasaron, 0 fallaron                                                    |
| `npx prettier --check .`                                                                | OK: todos los archivos con el estilo de Prettier                                                                                                        |
| `npm run build`                                                                         | OK: 47 páginas construidas                                                                                                                              |
| `npm run test:peso`                                                                     | OK: 47 páginas ≤ 120 KB gzip; máximo `kit/index.html` 19.3 KB (+0.4 KB contra la base, por SM-063)                                                      |
| `ASTRO_PREVIEW_BACKGROUND=1 npx playwright test`                                        | OK: 59 pasaron, 11 saltados; los 11 saltados son exactamente los tests `@abierta` (convocatoria, teclado, accesibilidad). Puerto 4321 libre al terminar |
| `sed abierta: true` en `src/content/convocatorias/edicion-02.md` && `npm run build`     | OK: build pasa; `<form data-netlify>` presente en `/convocatoria` y `/en/open-call`                                                                     |
| `CONVOCATORIA_ABIERTA=1 ASTRO_PREVIEW_BACKGROUND=1 npx playwright test --grep @abierta` | OK: 11 pasaron, 0 saltados (corrieron de verdad). Puerto 4321 libre                                                                                     |
| `git checkout -- src/content/convocatorias/edicion-02.md && npm run build`              | OK: vuelve a `abierta: false`; rebuild pasa; `<form>` ausente en los dos idiomas (0 coincidencias)                                                      |
| `git status --short` (al final) + `npx astro preview stop`                              | Limpio; no quedó ningún servidor preview corriendo. Sin push; worktrees y ramas `wt/` intactos                                                          |

**Gate en verde.** HEAD tras la integración: `d99acffcf72807fdc2cd532b9fd1a1244982be76`.

**Bloqueos de las líneas, no aplicados (quedan como mejora opcional):**

- **SM-063 / `Escudo.astro`**: propone agregar la prop `prioridad?: boolean` (mismo patrón que `FotoPegada.astro:70/85/127/128`) y pasar `prioridad` en `Edicion.astro:419`. Cambio chico (~4 líneas), pero no hace falta para el gate: los reportes crudos de la propia línea dan rendimiento móvil 100/97/97 en `/ediciones/buenos-aires-2026/`, ya ≥95 sin el cambio. Además toca un componente canónico que no es de ninguna línea, y `fetchpriority=high` sin volver a medir podría competir con el recurso LCP real tras el arreglo de fuentes.
- **SM-063 / `Sello.astro`**: propone agregar `prioridad?: boolean` en la rama `<Image>` y pasar `prioridad` a la instancia de `NoEncontrada.astro`. Mismo motivo que Escudo: componente canónico fuera de scope, y `/404` ya en 98/98/98 sin el cambio.

## Medición final (SM-061)

Medida en el commit `d99acffcf72807fdc2cd532b9fd1a1244982be76` (rama
`fase-5-qa-lanzamiento`, HEAD integrado "SM-063: carga de fuentes y
rendimiento móvil ≥ 95"; árbol limpio, único cambio nuevo:
`docs/capturas/fase-5/` sin commitear). Mismo método que la medición de
base (servidor estático propio en `127.0.0.1:4517`, Lighthouse CLI 13.0.3,
preset mobile, 3 corridas por ruta, mediana por categoría/métrica, peso en
gzip nivel 9, axe con `scripts/capturas-axe.mjs`), corrido de nuevo en
este build para que la comparación sea real y no arrastrada de la base.
Máquina más cargada que en la base (14.09–28.77 de 1 minuto contra
6.1–11.5): los puntajes de 98–100 con TBT 0 en todas las rutas son, si
algo, una medición conservadora.

| Ruta                            | Rend. | Accesib. | B. Prácticas | SEO | LCP     | CLS    | TBT  | Peso gzip | axe |
| ------------------------------- | ----- | -------- | ------------ | --- | ------- | ------ | ---- | --------- | --- |
| `/`                             | 99    | 100      | 100          | 100 | 2185 ms | 0.0100 | 0 ms | 15.8 KB   | 0   |
| `/manifiesto/`                  | 100   | 100      | 100          | 100 | 1430 ms | 0.0016 | 0 ms | 13.9 KB   | 0   |
| `/artistas/`                    | 100   | 100      | 100          | 100 | 1431 ms | 0.0012 | 0 ms | 13.9 KB   | 0   |
| `/artistas/herick-frontado/`    | 100   | 100      | 96           | 100 | 1588 ms | 0.0024 | 0 ms | 14.7 KB   | 0   |
| `/ediciones/`                   | 99    | 100      | 100          | 100 | 1885 ms | 0.0022 | 0 ms | 13.3 KB   | 0   |
| `/ediciones/buenos-aires-2026/` | 98    | 100      | 100          | 100 | 2405 ms | 0.0163 | 0 ms | 17.9 KB   | 0   |
| `/convocatoria/`                | 100   | 100      | 100          | 100 | 1430 ms | 0.0014 | 0 ms | 13.8 KB   | 0   |
| `/apoyar/`                      | 100   | 100      | 100          | 100 | 1433 ms | 0.0012 | 0 ms | 13.6 KB   | 0   |
| `/404`                          | 98    | 100      | 100          | 69  | 2266 ms | 0.0251 | 0 ms | 12.9 KB   | 0   |
| `/en/`                          | 99    | 100      | 100          | 100 | 2116 ms | 0.0101 | 0 ms | 15.4 KB   | 0   |

**Comparación contra la base:**

| Ruta                            | Rendimiento base → final |
| ------------------------------- | ------------------------ |
| `/`                             | 99 → 99                  |
| `/manifiesto/`                  | 95 → 100                 |
| `/artistas/`                    | 92 → 100                 |
| `/artistas/herick-frontado/`    | 99 → 100                 |
| `/ediciones/`                   | 99 → 99                  |
| `/ediciones/buenos-aires-2026/` | 95 → 98                  |
| `/convocatoria/`                | 95 → 100                 |
| `/apoyar/`                      | 99 → 100                 |
| `/404`                          | 92 → 98                  |
| `/en/`                          | 91 → 99                  |

Las 10 rutas quedan **≥ 95 en rendimiento** (antes, 3 estaban debajo: `/artistas/`
92, `/404` 92, `/en/` 91). El self-host de fuentes de SM-063 explica casi
toda la mejora: 0 referencias a `fonts.googleapis.com`/`fonts.gstatic.com`
en los 47 HTML del build (antes, una cadena crítica de 4 saltos con
~800–870 ms de render-blocking). TBT sigue en 0 ms y CLS ≤ 0.0251 en las
10 rutas — sube en algunas (por `optimizedFallbacks: false`, ver SM-063)
pero se mantiene muy por debajo del presupuesto de 0.1. axe: 0 violaciones
en las 36 páginas auditadas (18 rutas ES/EN × 2 anchos). Único puntaje
bajo 95: SEO 69 en `/404`, por el `<meta name="robots" content="noindex">`
deliberado (página de error, no debe indexarse) — estable en las 3
corridas, no es una falla.

Reportes crudos y resumen: `docs/capturas/fase-5/lighthouse-resumen.json`.

## Auditorías del repo

Dos auditorías automáticas sobre el diff integrado. Ambas con veredicto
**pass**; sin arreglos automáticos aplicados.

**Auditoría 1 — pass, 2 hallazgos menores:**

- _Convenciones — inventario de `<script>` permitidos (CLAUDE.md)_:
  CLAUDE.md dice "hoy son dos" (`Lightbox.astro` y la validación de
  `/convocatoria`), pero SM-065 agregó un tercer `<script>` en
  `Base.astro` (el beacon de Cloudflare). No es una violación — el script
  está autorizado explícitamente por CLAUDE.md y por el ticket, y va
  gateado por `tokenDeAnalyticsValido()`/`estaExcluidaDeAnalitica()` — es
  la documentación la que quedó desactualizada. Corregible en este PR o en
  uno de docs.
- _Fuera de alcance — derivar a accessibility-auditor_: el Tab-wrap dentro
  de los diálogos de `Nav.astro` y `Lightbox.astro` (SM-060) es manejo de
  foco/teclado puro, no toca color/tipografía/radio/sombra/movimiento DS
  §11, así que queda fuera del alcance de la auditoría de design system.
  Señalado para que no lea como omisión.

**Auditoría 2 — pass, sin hallazgos.**

## DoD de Fase 5 (PLAN §13)

- [x] Smoke pasa (Playwright: 59 passed, 11 skipped por `@abierta`, 0 failed).
- [x] Lighthouse ≥ 95 en las plantillas — las 10 rutas medidas quedan en
      98–100, salvo el SEO de `/404` en 69, explicado por el `noindex`
      deliberado de una página de error (no es una falla del gate).
- [x] axe sin errores (0 violaciones en 36 páginas auditadas).
- [ ] Contenido y traducciones revisados por una persona **[Rubén]**.
- [x] Dominio HTTPS — verificado en SM-064.
- [ ] Analytics registrando — **pendiente token real de Cloudflare de Rubén**;
      el beacon está implementado y gateado, pero sin token no se emite.
- [ ] Sitemap y robots publicados — listo en el build, queda publicado
      **tras el merge** a `main` y el deploy.
- [x] 404 on-brand (`Sello`, diseño aprobado, verificado en la medición).
- [ ] `main` protegida — a confirmar en GitHub (fuera del alcance de este
      informe).

## Pendientes de Rubén

- Token real de Cloudflare Web Analytics (`.env`/variable de entorno en
  Netlify) — sin él, el beacon de SM-065 no se emite.
- SM-062 (imágenes Open Graph) — no cubierto por esta fase.
- SM-066, SM-067, SM-068 — pendientes, fuera del alcance de este informe.
- Revisión humana de contenido y traducciones (ES/EN).
- Correr Lighthouse sobre el Deploy Preview real del PR #17 (lo corre el
  tech lead tras el push; esta medición fue contra un servidor estático
  local, no contra Netlify).
- Decisiones abiertas en las OBSERVACIONES de las líneas:
  - SM-063: revertir o no `optimizedFallbacks: false` dado el aumento de
    CLS (sigue muy por debajo de 0.1, pero es una decisión de trade-off
    explícita).
  - SM-063: aplicar o no los bloqueos de `Escudo.astro`/`Sello.astro`
    (prop `prioridad`), hoy no aplicados por ser componentes canónicos
    fuera de scope y no bloquear el gate.
  - SM-065: actualizar el "hoy son dos" `<script>` de CLAUDE.md a tres
    (hallazgo menor de la auditoría 1).
