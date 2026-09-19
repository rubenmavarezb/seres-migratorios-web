/**
 * SM-059 — /artistas: the index and a profile with a gallery, plus its
 * English twin. The artist is derived from the real collection (see
 * `./contenido.ts`), not hardcoded.
 */
import { expect, test } from '@playwright/test';

import { artistaConGaleria } from './contenido.ts';
import { sinNetlifyEnMetadatos } from './ayudantes.ts';

const artista = artistaConGaleria();

test.describe('artistas', () => {
  test(`índice → perfil de ${artista.nombre}`, async ({ page }) => {
    await page.goto('/artistas');
    await sinNetlifyEnMetadatos(page);

    await page.getByRole('link', { name: artista.nombre }).click();
    await expect(page).toHaveURL(new RegExp(`/artistas/${artista.slug}/?$`));
    await expect(page.getByRole('heading', { level: 1, name: artista.nombre })).toBeVisible();
    await sinNetlifyEnMetadatos(page);
  });

  test(`el gemelo EN de ${artista.nombre} responde`, async ({ page }) => {
    await page.goto(`/en/artists/${artista.slug}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: artista.nombre })).toBeVisible();
    await sinNetlifyEnMetadatos(page);
  });
});
