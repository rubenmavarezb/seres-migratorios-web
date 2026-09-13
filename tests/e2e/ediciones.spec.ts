/**
 * SM-059 — /ediciones: the index and the detail of the one real edition of
 * the collection (see `./contenido.ts`).
 */
import { expect, test } from '@playwright/test';

import es from '../../src/i18n/es.json' with { type: 'json' };
import { edicionExistente } from './contenido.ts';
import { sinNetlifyEnMetadatos } from './ayudantes.ts';

const edicion = edicionExistente();

/** Escapes regex metacharacters so a content string can be matched literally. */
function comoRegex(texto: string): RegExp {
  return new RegExp(texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

test.describe('ediciones', () => {
  test(`índice → detalle de "${edicion.nombre}"`, async ({ page }) => {
    await page.goto('/ediciones');
    await sinNetlifyEnMetadatos(page);

    await page.getByRole('link', { name: es.botones.verLaEdicion }).click();
    await expect(page).toHaveURL(new RegExp(`/ediciones/${edicion.slug}/?$`));
    // The design's single <h1> on this page is the "Seres Migratorios"
    // wordmark (Edicion.dc.html's poster header), shared by every edition —
    // it carries no per-edition text. The edition's own name is what `Seo`
    // composes into `<title>` (`Pagina`'s `titulo={data.nombre}`), so that is
    // what tells the two editions apart.
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(comoRegex(edicion.nombre));
    await sinNetlifyEnMetadatos(page);
  });
});
