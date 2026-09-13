/**
 * SM-060 — keyboard-only walkthroughs the backlog asks to be "verificada a
 * mano": skip link, desktop `Nav`, the mobile menu, the gallery/lightbox
 * pair, and the open call's form (its own `@abierta` block, guarded exactly
 * like `convocatoria.spec.ts` and `accesibilidad.spec.ts`'s own block).
 *
 * Every focus move here is a real `page.keyboard.press('Tab'/'Enter'/…)`,
 * never `locator.focus()`: this repo's outlines are all behind
 * `focus-visible`, which does not reliably match a programmatic `.focus()`
 * call — only real keyboard activation is guaranteed to set it (verified
 * empirically while building this spec).
 *
 * Deliberately NOT repeated here (already covered by `lightbox.spec.ts`):
 * opening a slide by click, `ArrowRight` moving to the next slide, and `Esc`
 * closing the dialog with focus back on the thumbnail. This file adds only
 * what that one does not: opening with the keyboard (`Enter`, not a click)
 * and the Tab wrap-around at the dialog's own boundary.
 */
import { expect, test } from '@playwright/test';

import { artistaConGaleria } from './contenido.ts';
import { CONVOCATORIA_ABIERTA } from './entorno.ts';

const artista = artistaConGaleria();

test.describe('skip link', () => {
  test('primer Tab enfoca el skip link y Enter salta la Nav', async ({ page }) => {
    await page.goto('/manifiesto/');

    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#contenido"]');
    await expect(skip).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#contenido$/);

    // The next Tab must land outside the header (Nav): if the skip link had
    // not actually moved the keyboard position, this Tab would re-enter the
    // brand link or the first nav link instead.
    await page.keyboard.press('Tab');
    const siguienteDentroDelHeader = await page.evaluate(
      () => document.activeElement?.closest('header') !== null
    );
    expect(
      siguienteDentroDelHeader,
      'el Tab posterior al skip link no debería reentrar a la Nav'
    ).toBe(false);
  });
});

test.describe('Nav de escritorio', () => {
  test('el primer link enfocado por Tab tiene el outline azul-sello de foco', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/manifiesto/');

    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // brand
    await page.keyboard.press('Tab'); // first Nav link

    const enlace = page.locator('nav a').first();
    await expect(enlace).toBeFocused();

    const estilo = await enlace.evaluate((nodo) => {
      const computado = getComputedStyle(nodo);
      return {
        outlineStyle: computado.outlineStyle,
        outlineWidth: computado.outlineWidth,
        outlineColor: computado.outlineColor,
        outlineOffset: computado.outlineOffset,
      };
    });
    expect(estilo.outlineStyle).toBe('solid');
    expect(estilo.outlineWidth).toBe('2px');
    expect(estilo.outlineOffset).toBe('2px');
    // azul-sello (#1B4BAF) as the browser resolves it.
    expect(estilo.outlineColor).toBe('rgb(27, 75, 175)');
  });
});

test.describe('menú móvil', () => {
  test('Enter en "Menú" abre el panel con teclado, Esc lo cierra y devuelve el foco', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/manifiesto/');

    const abrir = page.locator('#menu-abrir');
    const dialogo = page.locator('#menu');

    await expect(dialogo).toBeHidden();
    await abrir.focus();
    await page.keyboard.press('Enter');

    await expect(dialogo).toBeVisible();
    await expect(abrir).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-primer-enlace')).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialogo).toBeHidden();
    await expect(abrir).toHaveAttribute('aria-expanded', 'false');
    await expect(abrir).toBeFocused();
  });

  // DOM/tab order inside #menu (all <a>, Nav.astro): the "en" language
  // chip, Cerrar, the 5 nav links, then @seresmigratorios — 8 stops.
  // showModal() lands focus on "Manifiesto" (the 3rd of them), same as the
  // test above, so the last stop (@seresmigratorios) is 5 Tabs away and the
  // first (the "en" chip) is 2 Shift+Tabs away.
  test('Tab desde el último control del menú vuelve al primero, sin fugarse a body', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/manifiesto/');

    await page.locator('#menu-abrir').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#menu-primer-enlace')).toBeFocused();

    const menu = page.locator('#menu');
    const enlaceInstagram = menu.getByRole('link', { name: '@seresmigratorios' });
    const chipEn = menu.getByRole('link', { name: 'en', exact: true });

    // Manifiesto (position 3 of 8) → Artistas → Ediciones → Convocatoria →
    // Apoyar → @seresmigratorios (position 8): 5 Tabs.
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(enlaceInstagram).toBeFocused();

    await page.keyboard.press('Tab');
    const dentroDelMenu = await page.evaluate(
      () => document.activeElement?.closest('#menu') !== null
    );
    expect(dentroDelMenu, 'el Tab tras @seresmigratorios salió del menú móvil (a body)').toBe(true);
    await expect(chipEn).toBeFocused();
  });

  test('Shift+Tab desde el primer control del menú vuelve al último, sin fugarse a body', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/manifiesto/');

    await page.locator('#menu-abrir').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#menu-primer-enlace')).toBeFocused();

    const menu = page.locator('#menu');
    const chipEn = menu.getByRole('link', { name: 'en', exact: true });
    const enlaceInstagram = menu.getByRole('link', { name: '@seresmigratorios' });

    await page.keyboard.press('Shift+Tab'); // Cerrar
    await page.keyboard.press('Shift+Tab'); // "en" chip, the menu's own first control
    await expect(chipEn).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    const dentroDelMenu = await page.evaluate(
      () => document.activeElement?.closest('#menu') !== null
    );
    expect(
      dentroDelMenu,
      'el Shift+Tab desde el primer control salió del menú móvil (a body)'
    ).toBe(true);
    await expect(enlaceInstagram).toBeFocused();
  });
});

test.describe('galería → lightbox', () => {
  test(`Enter en una miniatura de ${artista.nombre} abre el lightbox (no navega a la imagen)`, async ({
    page,
  }) => {
    await page.goto(`/artistas/${artista.slug}`);
    const miniatura = page.locator('[data-galeria-foto]').first();
    const dialogo = page.locator('dialog[data-lightbox]');

    await miniatura.focus();
    await page.keyboard.press('Enter');

    await expect(dialogo).toBeVisible();
    // Confirms the click handler's `evento.preventDefault()` also worked for
    // a keyboard-triggered click: the browser stayed on the profile page
    // instead of following the thumbnail's `href` to the image file.
    await expect(page).toHaveURL(/\/artistas\//);
  });

  test('Tab dentro del lightbox queda atrapado entre sus 3 controles, sin fugarse a body', async ({
    page,
  }) => {
    await page.goto(`/artistas/${artista.slug}`);
    const miniatura = page.locator('[data-galeria-foto]').first();
    await miniatura.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('dialog[data-lightbox]')).toBeVisible();

    // Cerrar is the dialog's first focusable control (showModal()'s own
    // autofocus); six forward Tabs is two full laps of the 3-control cycle
    // (Cerrar → ← anterior → → siguiente), so every stop must stay inside
    // the dialog.
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      const dentroDelDialogo = await page.evaluate(
        () => document.activeElement?.closest('dialog[data-lightbox]') !== null
      );
      expect(dentroDelDialogo, `Tab #${i + 1} salió del <dialog> del lightbox`).toBe(true);
    }
  });
});

test.describe('formulario de convocatoria @abierta', () => {
  test.skip(
    !CONVOCATORIA_ABIERTA,
    'requiere un build con abierta: true (CONVOCATORIA_ABIERTA=1); ver docs/fase-5-qa-lanzamiento.md'
  );

  const ORDEN_ESPERADO = [
    'nombre',
    'ciudad',
    'pais',
    'email',
    'instagram',
    'portfolio',
    'disciplina',
    'edicion',
    'mensaje',
    'consentimiento',
  ];

  test('orden de Tab de los 10 campos + botón, sin pasar nunca por el honeypot', async ({
    page,
  }) => {
    await page.goto('/convocatoria/');
    const primerCampo = page.locator('[name="nombre"]');
    await primerCampo.focus();
    await expect(primerCampo).toBeFocused();

    const nombresRecorridos: string[] = ['nombre'];
    for (let i = 0; i < ORDEN_ESPERADO.length; i += 1) {
      await page.keyboard.press('Tab');
      const nombre = await page.evaluate(() => document.activeElement?.getAttribute('name'));
      expect(nombre, 'el recorrido de Tab no debe llegar nunca al honeypot').not.toBe('bot-field');
      if (nombre !== null && nombre !== undefined) nombresRecorridos.push(nombre);
    }

    // The last stop of the loop above is the submit button (no `name`, hence
    // absent from `nombresRecorridos`): confirmed separately below.
    expect(nombresRecorridos).toEqual(ORDEN_ESPERADO);

    const activoFinal = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      tipo: (document.activeElement as HTMLButtonElement | null)?.type,
    }));
    expect(activoFinal).toEqual({ tag: 'BUTTON', tipo: 'submit' });
  });
});
