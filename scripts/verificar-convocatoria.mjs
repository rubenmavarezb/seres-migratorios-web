/**
 * SM-055 / SM-070: browser checks against an already running preview.
 * Usage: node scripts/verificar-convocatoria.mjs http://localhost:4404 --abierta
 * Without --abierta, checks the closed state and both confirmation pages.
 * All POSTs are mocked: this script never sends an application to Netlify.
 */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.argv[2] ?? 'http://localhost:4404';
const abierta = process.argv.includes('--abierta');
const salida = 'docs/capturas/fase-4';
mkdirSync(salida, { recursive: true });
const browser = await chromium.launch();
const resultados = [];
try {
  for (const idioma of ['es', 'en']) {
    const textos = JSON.parse(readFileSync(`src/i18n/${idioma}.json`, 'utf8'));
    const ruta = idioma === 'es' ? '/convocatoria/' : '/en/open-call/';
    const gracias = idioma === 'es' ? '/gracias' : '/en/thanks';
    for (const javaScriptEnabled of abierta ? [true, false] : [true]) {
      const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
      const page = await context.newPage();
      let post;
      await page.route('**/*', async (route) => {
        if (route.request().method() !== 'POST') return route.continue();
        post = route.request();
        return route.fulfill({ status: 303, headers: { location: `${gracias}/` } });
      });
      await page.goto(new URL(ruta, base).href);
      const form = page.locator('form[name="convocatoria"]');
      if (!abierta) {
        await expect(form).toHaveCount(0);
        await expect(
          page.getByText(textos.convocatoria.cerrada.caja, { exact: true })
        ).toBeVisible();
      } else {
        await expect(form).toHaveAttribute('action', gracias);
        await expect(form.locator('[name="idioma"]')).toHaveValue(idioma);
        await expect(form.locator('[name="form-name"]')).toHaveValue('convocatoria');
        const honey = form.locator('[name="bot-field"]');
        await expect(honey).toHaveAttribute('hidden', '');
        await expect(honey).toHaveAttribute('tabindex', '-1');
        await expect(honey).toBeHidden();
        await expect(
          form.locator('input:not([hidden]):not([type="hidden"]), select, textarea')
        ).toHaveCount(10);
        assert.equal(await form.evaluate((el) => el.noValidate), javaScriptEnabled);
        assert.equal(await form.locator(':user-invalid').count(), 0);
        await form.locator('button[type="submit"]').click();
        assert.equal(post, undefined, 'An empty application must never submit');
        await expect(form.locator('[name="nombre"]')).toBeFocused();
        if (javaScriptEnabled) {
          await expect(form.locator('[role="alert"]')).toHaveText(textos.formulario.resumen);
          await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
          const errorId = await form.locator('[name="email"]').getAttribute('aria-describedby');
          await expect(page.locator(`#${errorId}`)).toHaveText(
            textos.formulario.errores.faltaEmail
          );
          await form.locator('[name="email"]').fill('invalido');
          await form.locator('[name="email"]').press('Tab');
          await expect(page.locator(`#${errorId}`)).toHaveText(
            textos.formulario.errores.emailInvalido
          );
          const axe = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
          assert.deepEqual(axe.violations, [], 'Errors must remain accessible');
          await page.screenshot({ path: `${salida}/SM-070-errores-${idioma}.png`, fullPage: true });
        } else {
          assert.ok((await form.locator(':user-invalid').count()) > 0);
        }
        // Explicit synthetic QA values: no person's application or contact data.
        for (const [name, value] of Object.entries({
          nombre: 'Prueba técnica SM-054',
          ciudad: '[CIUDAD DE PRUEBA]',
          pais: '[PAÍS DE PRUEBA]',
          email: 'qa@example.com',
        })) {
          await form.locator(`[name="${name}"]`).fill(value);
        }
        await form.locator('[name="disciplina"]').selectOption('fotografia');
        await form.locator('[name="consentimiento"]').check();
        for (const [name, invalid, valid] of [
          ['instagram', 'usuario', '@usuario'],
          ['portfolio', 'sin-url', 'https://example.com/'],
        ]) {
          await form.locator(`[name="${name}"]`).fill(invalid);
          await form.locator('button[type="submit"]').click();
          assert.equal(post, undefined, `${name} must block an invalid submission`);
          await form.locator(`[name="${name}"]`).fill(valid);
        }
        await form.locator('button[type="submit"]').click();
        await page.waitForURL(new URL(`${gracias}/`, base).href);
        assert.ok(post, 'A valid application must POST');
        const data = new URLSearchParams(post.postData());
        assert.equal(data.get('idioma'), idioma);
        assert.equal(data.get('bot-field'), '');
        assert.equal(data.get('form-name'), 'convocatoria');
      }
      await page.goto(new URL(`${gracias}/`, base).href);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(textos.gracias.titulo);
      const text = await page.locator('body').innerText();
      writeFileSync(`${salida}/SM-054-gracias-${idioma}.txt`, text);
      resultados.push({ idioma, javaScriptEnabled, abierta, resultado: 'OK' });
      await context.close();
    }
  }
  writeFileSync(
    `${salida}/verificacion-${abierta ? 'abierta' : 'cerrada'}.json`,
    JSON.stringify(resultados, null, 2) + '\n'
  );
  console.log(JSON.stringify(resultados, null, 2));
} finally {
  await browser.close();
}
