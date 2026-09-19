/**
 * SM-060 — axe (`@axe-core/playwright`) sweep of the site's canonical
 * templates, ES and their EN twins, at desktop (1440) and mobile (390),
 * tagged `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa`/`wcag22aa` (the tech lead's
 * five tags — `wcag22aa` is new versus SM-059's baseline measurement, which
 * only ran the first four; it adds 2.5.8 "target size" among other 2.2
 * criteria). 0 violations or the test fails, exactly as the backlog demands
 * ("cero errores de axe en las 8 plantillas").
 *
 * The nine templates the tech lead named (decision 1): home, manifiesto,
 * artistas índice, perfil, ediciones índice, detalle, convocatoria (cerrada),
 * apoyar, 404. `/gracias` and `/en/thanks` are added on top — they are real
 * public pages (the form's own `action` target) the tech lead's list left
 * out; see this ticket's OBSERVACIONES.
 *
 * The 404 routes are visited directly at `/404` and `/en/404/` (their real
 * built path — `dist/404.html` and `dist/en/404/index.html`), not through a
 * broken URL: `astro preview` does not replay `netlify.toml`'s
 * `/en/* -> /en/404/index.html` redirect (Netlify-only, production layer),
 * and axe only needs the rendered DOM, not a real HTTP 404 — the exact
 * reasoning already used for the Lighthouse baseline in this ticket's report.
 *
 * Two backlog rules axe cannot see on its own, because both only ever
 * surface in a state axe never triggers (`:hover`, `:focus`) — encoded as
 * explicit contrast assertions instead, with `ratioDeContraste`/
 * `esperarContrasteAA` (`./ayudantes.ts`) reading real computed colors off
 * the live DOM:
 * - "grafito nunca sobre azul-tinta-agua" (backlog SM-060).
 * - "azul-marcador solo en texto grande (≥ 24px o ≥ 18.66px bold)" — read
 *   from design-system.md §3.2/§4/§12 as governing the `Anotacion` manuscrita
 *   text branch specifically (the only place azul-marcador is *body* text;
 *   its many `hover:text-azul-marcador` links are underlined mono UI text
 *   already at 8.7:1 on papel — see this ticket's report for why those are
 *   out of this rule's scope).
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { artistaConGaleria, edicionExistente } from './contenido.ts';
import { CONVOCATORIA_ABIERTA } from './entorno.ts';
import { artistaConHandlePendiente, esperarContrasteAA } from './ayudantes.ts';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const VIEWPORTS = [
  { nombre: 'desktop', width: 1440, height: 900 },
  { nombre: 'mobile', width: 390, height: 844 },
] as const;

const artista = artistaConGaleria();
const edicion = edicionExistente();

interface Plantilla {
  nombre: string;
  rutaEs: string;
  rutaEn: string;
}

const PLANTILLAS: Plantilla[] = [
  { nombre: 'home', rutaEs: '/', rutaEn: '/en/' },
  { nombre: 'manifiesto', rutaEs: '/manifiesto/', rutaEn: '/en/manifesto/' },
  { nombre: 'artistas índice', rutaEs: '/artistas/', rutaEn: '/en/artists/' },
  {
    nombre: 'artistas perfil',
    rutaEs: `/artistas/${artista.slug}/`,
    rutaEn: `/en/artists/${artista.slug}/`,
  },
  { nombre: 'ediciones índice', rutaEs: '/ediciones/', rutaEn: '/en/editions/' },
  {
    nombre: 'ediciones detalle',
    rutaEs: `/ediciones/${edicion.slug}/`,
    rutaEn: `/en/editions/${edicion.slug}/`,
  },
  { nombre: 'convocatoria cerrada', rutaEs: '/convocatoria/', rutaEn: '/en/open-call/' },
  { nombre: 'apoyar', rutaEs: '/apoyar/', rutaEn: '/en/support/' },
  { nombre: '404', rutaEs: '/404', rutaEn: '/en/404/' },
  // Outside the tech lead's list (decision 1): real public pages the sweep
  // was missing — see OBSERVACIONES.
  { nombre: 'gracias', rutaEs: '/gracias/', rutaEn: '/en/thanks/' },
];

/**
 * "Azul-marcador solo en texto grande": every `Anotacion` text-branch node
 * (`span.text-azul-marcador.font-manuscrita`, its exact class pair — see
 * `Anotacion.astro`) must compute to ≥ 24px, or ≥ 18.66px when bold (WCAG's
 * own large-text definition, which is where the backlog's two numbers come
 * from).
 */
async function verificarAzulMarcadorGrande(page: Page): Promise<void> {
  const medidas = await page.$$eval('span.text-azul-marcador.font-manuscrita', (nodos) =>
    nodos.map((nodo) => {
      const estilo = getComputedStyle(nodo);
      return { size: parseFloat(estilo.fontSize), weight: Number(estilo.fontWeight) || 400 };
    })
  );
  for (const { size, weight } of medidas) {
    const esGrande = size >= 24 || (size >= 18.66 && weight >= 700);
    expect(
      esGrande,
      `Anotacion en azul-marcador de ${size.toFixed(2)}px (weight ${weight}) — el backlog exige ≥24px o ≥18.66px bold.`
    ).toBe(true);
  }
}

for (const plantilla of PLANTILLAS) {
  for (const { idioma, ruta } of [
    { idioma: 'es' as const, ruta: plantilla.rutaEs },
    { idioma: 'en' as const, ruta: plantilla.rutaEn },
  ]) {
    for (const viewport of VIEWPORTS) {
      test(`axe: ${plantilla.nombre} (${idioma}, ${viewport.nombre}) — ${ruta}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(ruta);
        const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        expect(resultados.violations, JSON.stringify(resultados.violations, null, 2)).toEqual([]);
        await verificarAzulMarcadorGrande(page);
      });
    }
  }
}

test.describe('convocatoria abierta @abierta', () => {
  test.skip(
    !CONVOCATORIA_ABIERTA,
    'requiere un build con abierta: true (CONVOCATORIA_ABIERTA=1); ver docs/fase-5-qa-lanzamiento.md'
  );

  for (const { idioma, ruta } of [
    { idioma: 'es' as const, ruta: '/convocatoria/' },
    { idioma: 'en' as const, ruta: '/en/open-call/' },
  ]) {
    for (const viewport of VIEWPORTS) {
      test(`axe: convocatoria abierta (${idioma}, ${viewport.nombre}) — ${ruta}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(ruta);
        const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        expect(resultados.violations, JSON.stringify(resultados.violations, null, 2)).toEqual([]);
      });
    }
  }
});

test.describe('contraste de estado (backlog SM-060: grafito nunca sobre azul-tinta-agua)', () => {
  test('fila de /artistas/ en hover: numero y rol pasan a tinta-suave, no grafito', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/artistas/');

    const fila = page.locator('[data-fila-artista]').first();
    await fila.hover();
    // `CLASES_FILA` transitions its background over 150ms
    // (`transition-colors duration-150`, `Artistas.astro`); reading
    // `getComputedStyle` right after `hover()` can catch it mid-interpolation
    // (flaky, verified empirically), so this waits the transition out first.
    await page.waitForTimeout(200);

    // Row spans in DOM order: 0 numero, 1 nombre, 2 handle, 3 rol
    // (`Artistas.astro`'s `aFila`/markup) — `nth(3)` is the rol span this
    // test means to read, not the handle at `nth(2)`.
    const [colorFondo, colorNumero, colorRol] = await Promise.all([
      fila.evaluate((nodo) => getComputedStyle(nodo).backgroundColor),
      fila
        .locator('span')
        .first()
        .evaluate((nodo) => getComputedStyle(nodo).color),
      fila
        .locator('span')
        .nth(3)
        .evaluate((nodo) => getComputedStyle(nodo).color),
    ]);

    esperarContrasteAA(colorNumero, colorFondo, false, 'span de "número" en hover de /artistas/');
    esperarContrasteAA(colorRol, colorFondo, false, 'span de "rol" en hover de /artistas/');
  });

  test('fila de /artistas/ en hover con handle pendiente: placeholder pasa a tinta-suave, no grafito', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/artistas/');

    const artista = artistaConHandlePendiente();
    const fila = page.locator(`[data-fila-artista][href*="${artista.slug}"]`);
    await fila.hover();
    // Same transition-settle reasoning as the test above.
    await page.waitForTimeout(200);

    // Row spans in DOM order: 0 numero, 1 nombre, 2 handle, 3 rol — `nth(2)`
    // is the placeholder handle (`CLASE_HANDLE_PLACEHOLDER`, `Artistas.astro`)
    // this test means to read, the one span the other hover test does not
    // cover.
    const [colorFondo, colorHandle] = await Promise.all([
      fila.evaluate((nodo) => getComputedStyle(nodo).backgroundColor),
      fila
        .locator('span')
        .nth(2)
        .evaluate((nodo) => getComputedStyle(nodo).color),
    ]);

    esperarContrasteAA(
      colorHandle,
      colorFondo,
      false,
      `span de handle pendiente de ${artista.nombre} en hover de /artistas/`
    );
  });

  test('placeholder de Campo en foco: /kit pasa a tinta-suave, no grafito', async ({ page }) => {
    await page.goto('/kit');
    const campo = page.locator('#kit-instagram');
    await campo.focus();
    // Same transition-settle reasoning as the /artistas/ test above
    // (`Campo.astro`'s control also carries `transition-colors`).
    await page.waitForTimeout(200);

    const [colorFondo, colorPlaceholder] = await Promise.all([
      campo.evaluate((nodo) => getComputedStyle(nodo).backgroundColor),
      campo.evaluate((nodo) => {
        const antes = getComputedStyle(nodo, '::placeholder');
        return antes.color;
      }),
    ]);

    esperarContrasteAA(
      colorPlaceholder,
      colorFondo,
      false,
      'placeholder de Campo#kit-instagram en foco'
    );
  });
});
