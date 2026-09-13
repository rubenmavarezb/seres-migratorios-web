/**
 * Shared assertions for the e2e specs (SM-059).
 */
import { expect, type Page } from '@playwright/test';

/**
 * SM-064's rule, as a reusable assertion: canonical and `og:url` must always
 * point at the public domain (`Seo.astro`, `astro.config.mjs`), never at the
 * internal `seres-migratorios.netlify.app` preview host.
 */
export async function sinNetlifyEnMetadatos(page: Page): Promise<void> {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
  expect(canonical, 'falta <link rel="canonical">').not.toBeNull();
  expect(canonical).not.toContain('netlify.app');
  expect(ogUrl, 'falta <meta property="og:url">').not.toBeNull();
  expect(ogUrl).not.toContain('netlify.app');
}
