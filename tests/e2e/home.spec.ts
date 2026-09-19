/**
 * SM-059 — home smoke: the Spanish default locale and its English twin.
 * Covers CLAUDE.md's "un solo <h1> por página", SM-064's canonical rule and
 * the `Nav` language selector's link to the sibling route (SM-049).
 */
import { expect, test } from '@playwright/test';

import { sinNetlifyEnMetadatos } from './ayudantes.ts';

test.describe('home ES', () => {
  test('lang=es, un solo h1 y canonical al dominio público', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://seresmigratorios.com/'
    );
    await sinNetlifyEnMetadatos(page);
  });
});

test.describe('home EN', () => {
  test('lang=en y el selector de idioma lleva a la ruta gemela', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await sinNetlifyEnMetadatos(page);

    // Scoped to <header>: the mobile full-screen menu (a sibling <dialog>,
    // closed by default) renders the same "es"/"en" chips a second time.
    // `exact: true`: a substring match on "es" also catches "Seres
    // Migratorios" and "Manifesto".
    const selectorEs = page.locator('header').getByRole('link', { name: 'es', exact: true });
    await expect(selectorEs).toHaveAttribute('href', '/');
    await selectorEs.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});
