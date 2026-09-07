#!/usr/bin/env node
/**
 * Screenshots and axe audit of a list of routes, at the two widths every
 * ticket of this repo documents (1440 desktop, 390 mobile).
 *
 * Fase 3 acceptance (PLAN.md §13, backlog SM-048 / SM-060): every EN route
 * gets a capture in `docs/capturas/fase-3/` and reports 0 axe violations at
 * both widths. Before this script each line of work improvised its own
 * Playwright snippet; this is the single, repeatable version of that gate,
 * usable for the ES routes too.
 *
 * It only uses devDependencies already approved in PLAN.md §14
 * (`playwright`, pulled by `@playwright/test`, and `@axe-core/playwright`).
 *
 * Usage:
 *   npm run build
 *   node scripts/capturas-axe.mjs --en                       # the 8 EN routes
 *   node scripts/capturas-axe.mjs --es                       # the 8 ES routes
 *   node scripts/capturas-axe.mjs /en/ /en/artists/          # explicit routes
 *   node scripts/capturas-axe.mjs --en --prefijo SM-048 --salida docs/capturas/fase-3
 *   node scripts/capturas-axe.mjs --en --sin-capturas        # axe only
 *   node scripts/capturas-axe.mjs --en --sin-axe             # captures only
 *   node scripts/capturas-axe.mjs --en --base http://localhost:4321   # server already up
 *
 * Without `--base` it starts `astro preview` on a free port, serves `dist/`
 * (run `npm run build` first) and stops it at the end.
 *
 * File names: `<prefijo>-<ruta>-<ancho>.png`, where `<ruta>` is the path with
 * slashes turned into dashes, `home` for the root of each language and an
 * `-en` suffix for the English routes: `SM-048-home-en-1440.png`,
 * `SM-048-artists-herick-frontado-en-390.png`.
 *
 * Captures are full-page. The entrances of DS §11 are scroll-driven
 * (`animation-timeline: view()`), so an element below the fold sits at its
 * initial state until it enters the viewport; a naive full-page capture would
 * show those elements half-faded. The page is therefore rendered in a viewport
 * as tall as the document before the capture, so every entrance has finished.
 *
 * Exit code 1 when axe reports at least one violation (or a route fails to
 * load); 0 otherwise.
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

/** Content slugs used for the two dynamic routes: real entries of `src/content/`. */
const SLUG_ARTISTA = 'herick-frontado';
const SLUG_EDICION = 'buenos-aires-2026';

const RUTAS_ES = [
  '/',
  '/manifiesto/',
  '/artistas/',
  `/artistas/${SLUG_ARTISTA}/`,
  '/ediciones/',
  `/ediciones/${SLUG_EDICION}/`,
  '/apoyar/',
  '/404',
];

const RUTAS_EN = [
  '/en/',
  '/en/manifesto/',
  '/en/artists/',
  `/en/artists/${SLUG_ARTISTA}/`,
  '/en/editions/',
  `/en/editions/${SLUG_EDICION}/`,
  '/en/support/',
  '/en/404/',
];

const OPCIONES_CON_VALOR = new Set(['--base', '--salida', '--prefijo', '--anchos']);
const rutasExplicitas = args.filter(
  (a, i) => !a.startsWith('--') && !OPCIONES_CON_VALOR.has(args[i - 1])
);
const rutas = [
  ...(flag('--es') ? RUTAS_ES : []),
  ...(flag('--en') ? RUTAS_EN : []),
  ...rutasExplicitas,
];

if (rutas.length === 0) {
  console.error('capturas-axe: indicá rutas, o --es / --en para los presets.');
  process.exit(2);
}

const salida = opt('--salida', 'docs/capturas/fase-3');
const prefijo = opt('--prefijo', 'SM-048');
const anchos = opt('--anchos', '1440,390')
  .split(',')
  .map((a) => Number.parseInt(a, 10))
  .filter((a) => Number.isFinite(a) && a > 0);
const conCapturas = !flag('--sin-capturas');
const conAxe = !flag('--sin-axe');

/** WCAG 2.0 / 2.1 A and AA, the level CLAUDE.md requires ("Contraste AA"). */
const ETIQUETAS_AXE = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/** `/en/artists/herick-frontado/` -> `artists-herick-frontado-en`; `/` -> `home`. */
function nombreDeRuta(ruta) {
  const segmentos = ruta.split('/').filter(Boolean);
  const esEn = segmentos[0] === 'en';
  const resto = esEn ? segmentos.slice(1) : segmentos;
  const base = resto.length === 0 ? 'home' : resto.join('-');
  return esEn ? `${base}-en` : base;
}

/** Waits until the preview server answers, or gives up after `intentos` × 250 ms. */
async function esperarServidor(base, intentos = 80) {
  for (let i = 0; i < intentos; i++) {
    try {
      const respuesta = await fetch(base);
      if (respuesta.status < 500) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`El servidor en ${base} no respondió.`);
}

/**
 * Starts `astro preview` and resolves with its base URL and a function that
 * stops it. It asks for port 4399 (not the 4321 of `npm run preview`, so a
 * preview left open in another terminal never clashes) and reads the URL
 * `astro preview` actually prints, in case it had to move to another port.
 */
function arrancarPreview() {
  return new Promise((resolve, reject) => {
    const proceso = spawn('npx', ['astro', 'preview', '--port', '4399'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let salidaTexto = '';
    const detener = () => {
      if (!proceso.killed) proceso.kill('SIGTERM');
    };
    const buscarUrl = (trozo) => {
      salidaTexto += trozo.toString();
      const m = salidaTexto.match(/https?:\/\/localhost:(\d+)\/?/);
      if (m) {
        proceso.stdout.off('data', buscarUrl);
        proceso.stderr.off('data', buscarUrl);
        resolve({ base: `http://localhost:${m[1]}`, detener });
      }
    };
    proceso.stdout.on('data', buscarUrl);
    proceso.stderr.on('data', buscarUrl);
    proceso.on('error', reject);
    proceso.on('exit', (codigo) => {
      if (!salidaTexto.match(/localhost:\d+/)) {
        reject(
          new Error(
            `astro preview terminó (código ${codigo}) sin publicar una URL:\n${salidaTexto}`
          )
        );
      }
    });
  });
}

async function main() {
  let base = opt('--base', undefined);
  let detener = () => {};
  if (base === undefined) {
    ({ base, detener } = await arrancarPreview());
  }
  base = base.replace(/\/$/, '');
  await esperarServidor(base);

  if (conCapturas) mkdirSync(salida, { recursive: true });

  const navegador = await chromium.launch();
  let violacionesTotales = 0;
  let fallos = 0;

  try {
    for (const ruta of rutas) {
      for (const ancho of anchos) {
        const contexto = await navegador.newContext({
          viewport: { width: ancho, height: 900 },
          deviceScaleFactor: 1,
        });
        const pagina = await contexto.newPage();
        const url = `${base}${ruta}`;
        const nombre = `${prefijo}-${nombreDeRuta(ruta)}-${ancho}`;
        try {
          const respuesta = await pagina.goto(url, { waitUntil: 'networkidle' });
          const estado = respuesta?.status() ?? 0;
          // The 404 routes answer 404 by design; anything else must be 200.
          const es404 = /\/404\/?$/.test(ruta);
          if (!(estado === 200 || (es404 && estado === 404))) {
            fallos++;
            console.error(`✗ ${nombre}: HTTP ${estado} en ${url}`);
            continue;
          }

          let resumen = `${nombre}: HTTP ${estado}`;

          if (conAxe) {
            const resultados = await new AxeBuilder({ page: pagina })
              .withTags(ETIQUETAS_AXE)
              .analyze();
            const violaciones = resultados.violations;
            violacionesTotales += violaciones.length;
            resumen += ` · axe ${violaciones.length} violación(es)`;
            for (const v of violaciones) {
              console.error(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodo/s)`);
              for (const nodo of v.nodes.slice(0, 3)) {
                console.error(`      ${nodo.target.join(' ')}`);
              }
            }
          }

          if (conCapturas) {
            // Viewport as tall as the document so every scroll-driven entrance
            // (DS §11) has reached its final state before the capture.
            const alto = await pagina.evaluate(() => document.documentElement.scrollHeight);
            await pagina.setViewportSize({ width: ancho, height: Math.min(alto, 20000) });
            await pagina.waitForTimeout(400);
            const archivo = join(salida, `${nombre}.png`);
            await pagina.screenshot({ path: archivo, fullPage: true });
            resumen += ` · ${archivo}`;
          }

          console.log(`${conAxe && resumen.includes(' 0 violación') ? '✓' : '·'} ${resumen}`);
        } catch (error) {
          fallos++;
          console.error(`✗ ${nombre}: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          await contexto.close();
        }
      }
    }
  } finally {
    await navegador.close();
    detener();
  }

  const conteo = `${rutas.length} ruta(s) × ${anchos.length} ancho(s)`;
  if (fallos > 0 || violacionesTotales > 0) {
    console.error(
      `capturas-axe: ${conteo} — ${fallos} fallo(s) de carga, ${violacionesTotales} violación(es) de axe.`
    );
    process.exitCode = 1;
    return;
  }
  console.log(`capturas-axe: OK — ${conteo}${conAxe ? ', 0 violaciones de axe' : ''}.`);
}

main().catch((error) => {
  console.error(`capturas-axe: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
