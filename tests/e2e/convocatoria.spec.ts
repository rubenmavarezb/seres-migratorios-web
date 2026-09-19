/**
 * SM-059 — /convocatoria and its English twin /en/open-call.
 *
 * Convocatoria 02 is CLOSED (`abierta: false`) in every committed build, so
 * the "cerrada" suite below always runs. The "abierta" suite is tagged
 * `@abierta` in every title and additionally guarded with `test.skip`: it
 * only runs when `CONVOCATORIA_ABIERTA=1`, which is set solely by the CI step
 * that patches `src/content/convocatorias/edicion-02.md` to `abierta: true`,
 * rebuilds, and re-runs `playwright test --grep @abierta` against that build
 * (see `.github/workflows/ci.yml` and this ticket's report in
 * `docs/fase-5-qa-lanzamiento.md`). Both suites skip the other's build state
 * so neither can pass by accident against the wrong content.
 *
 * All POSTs are mocked with `page.route`: this spec never sends an
 * application to Netlify (reusing the pattern already proven in
 * `scripts/verificar-convocatoria.mjs`, which this file does not replace —
 * that script keeps doing its own fuller manual/visual pass).
 */
import { expect, test, type Request } from '@playwright/test';

import es from '../../src/i18n/es.json' with { type: 'json' };
import en from '../../src/i18n/en.json' with { type: 'json' };
import { CONVOCATORIA_ABIERTA } from './entorno.ts';
import { sinNetlifyEnMetadatos } from './ayudantes.ts';

interface RutaDeIdioma {
  idioma: 'es' | 'en';
  ruta: string;
  gracias: string;
  nombreFormulario: string;
  textos: typeof es;
}

const RUTAS: RutaDeIdioma[] = [
  {
    idioma: 'es',
    ruta: '/convocatoria',
    gracias: '/gracias',
    nombreFormulario: 'convocatoria',
    textos: es,
  },
  {
    idioma: 'en',
    ruta: '/en/open-call',
    gracias: '/en/thanks',
    nombreFormulario: 'open-call',
    textos: en,
  },
];

test.describe('convocatoria cerrada', () => {
  test.skip(
    CONVOCATORIA_ABIERTA,
    'este build corrió con CONVOCATORIA_ABIERTA=1 (convocatoria abierta)'
  );

  for (const { idioma, ruta, textos } of RUTAS) {
    test(`${ruta} no tiene <form> y muestra el estado cerrado`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator('html')).toHaveAttribute('lang', idioma);
      await expect(page.locator('form')).toHaveCount(0);
      await expect(page.getByText(textos.convocatoria.cerrada.caja, { exact: true })).toBeVisible();
      await sinNetlifyEnMetadatos(page);
    });
  }
});

test.describe('convocatoria abierta @abierta', () => {
  test.skip(
    !CONVOCATORIA_ABIERTA,
    'requiere un build con abierta: true (CONVOCATORIA_ABIERTA=1); ver docs/fase-5-qa-lanzamiento.md'
  );

  for (const { idioma, ruta, gracias, nombreFormulario, textos } of RUTAS) {
    test(`${ruta}: postulación mockeada llega a ${gracias}`, async ({ page }) => {
      await page.goto(ruta);
      const form = page.locator('form');
      await expect(form).toHaveAttribute('name', nombreFormulario);
      // Asserts the product's actual submission target (CLAUDE.md:
      // action="/gracias" ES, action="/en/thanks" EN) — without this, a
      // `rutaLocalizada` regression that points the form at the wrong twin
      // goes undetected, because the mock below would redirect there anyway.
      await expect(form).toHaveAttribute('action', gracias);
      await expect(form.locator('[name="idioma"]')).toHaveValue(idioma);
      await expect(form.locator('[name="form-name"]')).toHaveValue(nombreFormulario);

      let solicitudPost: Request | undefined;
      await page.route('**/*', async (route) => {
        if (route.request().method() !== 'POST') {
          await route.continue();
          return;
        }
        solicitudPost = route.request();
        await route.fulfill({ status: 303, headers: { location: `${gracias}/` } });
      });

      await form.locator('[name="nombre"]').fill('Prueba técnica SM-059');
      await form.locator('[name="ciudad"]').fill('[CIUDAD DE PRUEBA]');
      await form.locator('[name="pais"]').fill('[PAÍS DE PRUEBA]');
      await form.locator('[name="email"]').fill('qa@example.com');
      await form.locator('[name="disciplina"]').selectOption({ index: 1 });
      await form.locator('[name="consentimiento"]').check();
      await form.locator('button[type="submit"]').click();

      await page.waitForURL(new RegExp(`${gracias}/?$`));
      expect(solicitudPost, 'una postulación válida tiene que hacer POST').toBeDefined();
      // The mock's `location` header is controlled by this test, so it can't
      // prove the form posted to the right place — that the browser actually
      // submitted to `gracias` (not merely that the response redirected
      // there) is what the `action` pathname of the captured request shows.
      expect(new URL(solicitudPost!.url()).pathname).toBe(gracias);
      const datos = new URLSearchParams(solicitudPost?.postData() ?? '');
      expect(datos.get('idioma')).toBe(idioma);
      expect(datos.get('form-name')).toBe(nombreFormulario);
      expect(datos.get('bot-field')).toBe('');
    });

    test(`${ruta}: el honeypot no es alcanzable con Tab`, async ({ page }) => {
      await page.goto(ruta);

      // Deterministic check: a `hidden` field can never become the focused
      // element, by Tab or by script — this is what unreachability actually
      // rests on.
      const seEnfoco = await page.evaluate(() => {
        const campo = document.querySelector<HTMLElement>('[name="bot-field"]');
        campo?.focus();
        return document.activeElement === campo;
      });
      expect(seEnfoco).toBe(false);

      // Real Tab traversal from the top of the page, through the Nav and into
      // the form: the honeypot's name must never show up as the active
      // element at any step.
      for (let i = 0; i < 25; i += 1) {
        await page.keyboard.press('Tab');
        const nombreEnfocado = await page.evaluate(
          () => document.activeElement?.getAttribute('name') ?? null
        );
        expect(nombreEnfocado).not.toBe('bot-field');
      }
    });

    test(`${ruta}: error accesible con JS (aria-invalid + resumen role=alert)`, async ({
      page,
    }) => {
      await page.goto(ruta);
      const form = page.locator('form');

      // An empty required field is enough to trigger the page's own
      // Constraint-Validation-API handling (SM-070): submit is blocked and
      // the error summary + aria-invalid appear with no page reload.
      await form.locator('button[type="submit"]').click();
      await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
      await expect(form.locator('[role="alert"]')).toHaveText(textos.formulario.resumen);
    });
  }
});
