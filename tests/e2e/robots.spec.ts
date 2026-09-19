/**
 * SM-059 / SM-065 — `/robots.txt` always emits a `Sitemap:` line built from
 * `site` (never a hardcoded domain).
 */
import { expect, test } from '@playwright/test';

test.describe('robots.txt', () => {
  test('responde con la línea Sitemap', async ({ request }) => {
    const respuesta = await request.get('/robots.txt');
    expect(respuesta.ok()).toBe(true);
    const cuerpo = await respuesta.text();
    expect(cuerpo).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap-index\.xml$/m);
  });
});
