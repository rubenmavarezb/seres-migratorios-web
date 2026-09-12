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
