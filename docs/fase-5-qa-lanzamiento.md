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
