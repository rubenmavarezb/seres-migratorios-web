/**
 * SM-059 — lightbox of `internos/Lightbox.astro`, on the profile whose
 * gallery has the most photos (see `./contenido.ts`): open from a thumbnail,
 * `<dialog>` open, arrow navigation, `Esc` closes it and focus returns to the
 * thumbnail that opened it (CLAUDE.md, "Lightbox con <dialog>: foco atrapado,
 * Esc cierra, el foco vuelve al disparador").
 */
import { expect, test } from '@playwright/test';

import { artistaConGaleria } from './contenido.ts';

const artista = artistaConGaleria();

test.describe('lightbox', () => {
  test(`abre desde una miniatura de ${artista.nombre}, navega y Esc devuelve el foco`, async ({
    page,
  }) => {
    await page.goto(`/artistas/${artista.slug}`);

    const miniatura = page.locator('[data-galeria-foto]').first();
    const dialogo = page.locator('dialog[data-lightbox]');
    const diapositivaVisible = page.locator('[data-lightbox-foto]:not([hidden])');

    await expect(dialogo).toBeHidden();
    await miniatura.click();
    await expect(dialogo).toBeVisible();
    await expect(diapositivaVisible).toHaveAttribute('data-indice', '0');

    await page.keyboard.press('ArrowRight');
    await expect(diapositivaVisible).toHaveAttribute('data-indice', '1');

    await page.keyboard.press('Escape');
    await expect(dialogo).toBeHidden();
    await expect(miniatura).toBeFocused();
  });
});
