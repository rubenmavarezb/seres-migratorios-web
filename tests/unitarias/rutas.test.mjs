// Unit tests for the route table of `src/i18n/rutas.ts` (SM-045).
//
// Runs on Node's built-in test runner with no dependencies: Node 22.22 strips
// the types of the imported `.ts` module on its own, so no flag and no bundler
// are involved. That is why `rutas.ts` imports nothing — see its header.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  IDIOMAS,
  IDIOMA_POR_DEFECTO,
  RUTAS,
  idiomaDeUrl,
  rutaBase,
  rutaLocalizada,
  rutasAlternativas,
} from '../../src/i18n/rutas.ts';

/**
 * The ten routes of sitemap.md §1, written out by hand: the test must not
 * re-derive the very table it is checking. The two dynamic routes carry a real
 * content slug (`ruben-mavarez` from the design's `hrefsExponen`,
 * `buenos-aires-2026` from sitemap.md §1), which is never translated.
 */
const EQUIVALENCIAS = [
  { nombre: 'home', clave: 'home', es: '/', en: '/en/' },
  { nombre: 'manifiesto', clave: 'manifiesto', es: '/manifiesto', en: '/en/manifesto' },
  { nombre: 'artistas', clave: 'artistas', es: '/artistas', en: '/en/artists' },
  {
    nombre: 'artista',
    clave: 'artista',
    es: '/artistas/ruben-mavarez',
    en: '/en/artists/ruben-mavarez',
    slug: 'ruben-mavarez',
  },
  { nombre: 'ediciones', clave: 'ediciones', es: '/ediciones', en: '/en/editions' },
  {
    nombre: 'edicion',
    clave: 'edicion',
    es: '/ediciones/buenos-aires-2026',
    en: '/en/editions/buenos-aires-2026',
    slug: 'buenos-aires-2026',
  },
  { nombre: 'convocatoria', clave: 'convocatoria', es: '/convocatoria', en: '/en/open-call' },
  { nombre: 'apoyar', clave: 'apoyar', es: '/apoyar', en: '/en/support' },
  { nombre: 'gracias', clave: 'gracias', es: '/gracias', en: '/en/thanks' },
  { nombre: '404', clave: 'noEncontrada', es: '/404', en: '/en/404' },
];

/** Home of each language, used as the anti-fallback reference. */
const HOME = { es: '/', en: '/en/' };

/** Adds a trailing slash without doubling the one the home already has. */
const conBarraFinal = (ruta) => (ruta.endsWith('/') ? ruta : `${ruta}/`);

describe('constantes', () => {
  it('IDIOMAS es [es, en] y el idioma por defecto es es', () => {
    assert.deepEqual([...IDIOMAS], ['es', 'en']);
    assert.equal(IDIOMA_POR_DEFECTO, 'es');
  });

  it('la tabla tiene las 10 rutas de sitemap.md §1', () => {
    assert.equal(RUTAS.length, 10);
    assert.deepEqual(
      RUTAS.map((entrada) => entrada.clave),
      EQUIVALENCIAS.map((equivalencia) => equivalencia.clave)
    );
  });
});

describe('rutaLocalizada · ES → EN', () => {
  for (const { nombre, es, en } of EQUIVALENCIAS) {
    it(`${nombre}: ${es} → ${en}`, () => {
      assert.equal(rutaLocalizada(es, 'en'), en);
      // The criterion is explicit: the equivalent route, not the home.
      if (nombre !== 'home') assert.notEqual(rutaLocalizada(es, 'en'), HOME.en);
    });
  }
});

describe('rutaLocalizada · EN → ES', () => {
  for (const { nombre, es, en } of EQUIVALENCIAS) {
    it(`${nombre}: ${en} → ${es}`, () => {
      assert.equal(rutaLocalizada(en, 'es'), es);
      if (nombre !== 'home') assert.notEqual(rutaLocalizada(en, 'es'), HOME.es);
    });
  }
});

describe('rutaLocalizada · al mismo idioma devuelve la misma ruta', () => {
  for (const { nombre, es, en } of EQUIVALENCIAS) {
    it(`${nombre}: ${es} y ${en} quedan igual`, () => {
      assert.equal(rutaLocalizada(es, 'es'), es);
      assert.equal(rutaLocalizada(en, 'en'), en);
    });
  }
});

describe('rutaLocalizada · tolera la barra final', () => {
  for (const { nombre, es, en } of EQUIVALENCIAS) {
    it(`${nombre}: ${conBarraFinal(es)} y ${conBarraFinal(en)}`, () => {
      assert.equal(rutaLocalizada(conBarraFinal(es), 'en'), en);
      assert.equal(rutaLocalizada(conBarraFinal(en), 'es'), es);
    });
  }
});

describe('rutaLocalizada · slugs dinámicos', () => {
  const slugs = ['ruben-mavarez', 'gabriela-rondon', 'buenos-aires-2026', 'edicion-01'];

  for (const slug of slugs) {
    it(`artista: conserva "${slug}" en las dos direcciones`, () => {
      assert.equal(rutaLocalizada(`/artistas/${slug}`, 'en'), `/en/artists/${slug}`);
      assert.equal(rutaLocalizada(`/en/artists/${slug}`, 'es'), `/artistas/${slug}`);
    });

    it(`edición: conserva "${slug}" en las dos direcciones`, () => {
      assert.equal(rutaLocalizada(`/ediciones/${slug}`, 'en'), `/en/editions/${slug}`);
      assert.equal(rutaLocalizada(`/en/editions/${slug}`, 'es'), `/ediciones/${slug}`);
    });
  }

  it('el índice gana sobre la ruta dinámica con slug vacío', () => {
    assert.equal(rutaLocalizada('/artistas', 'en'), '/en/artists');
    assert.equal(rutaLocalizada('/ediciones/', 'en'), '/en/editions');
  });
});

describe('rutaLocalizada · ruta desconocida cae en la home del idioma pedido', () => {
  const desconocidas = [
    '/inexistente',
    '/en/nope',
    '/artistas/ruben-mavarez/obra',
    '/kit',
    '/manifiestoo',
    '',
  ];

  for (const ruta of desconocidas) {
    it(`"${ruta}" → / y /en/`, () => {
      assert.equal(rutaLocalizada(ruta, 'es'), HOME.es);
      assert.equal(rutaLocalizada(ruta, 'en'), HOME.en);
    });
  }
});

describe('idiomaDeUrl', () => {
  const casos = [
    ['URL absoluta EN', new URL('https://seres-migratorios.netlify.app/en/artists'), 'en'],
    ['URL absoluta ES', new URL('https://seres-migratorios.netlify.app/artistas'), 'es'],
    ['URL absoluta home ES', new URL('https://seres-migratorios.netlify.app/'), 'es'],
    [
      'cadena absoluta EN',
      'https://seres-migratorios.netlify.app/en/editions/buenos-aires-2026',
      'en',
    ],
    ['ruta relativa EN con barra final', '/en/', 'en'],
    ['ruta relativa EN sin barra final', '/en', 'en'],
    ['ruta relativa ES', '/convocatoria', 'es'],
    ['home ES', '/', 'es'],
    ['prefijo parcial no cuenta', '/english', 'es'],
    ['"en" en otro segmento no cuenta', '/artistas/en', 'es'],
    ['query y hash se ignoran', '/en/support?origen=nav#aporte', 'en'],
    ['ruta sin barra inicial', 'en/support', 'en'],
  ];

  for (const [nombre, entrada, esperado] of casos) {
    it(`${nombre} → ${esperado}`, () => {
      assert.equal(idiomaDeUrl(entrada), esperado);
    });
  }
});

describe('rutaBase', () => {
  for (const { nombre, clave, es, en, slug } of EQUIVALENCIAS) {
    it(`${nombre}: identifica las dos versiones como "${clave}"`, () => {
      assert.deepEqual(rutaBase(es), { clave, idioma: 'es', slug: slug ?? null });
      assert.deepEqual(rutaBase(en), { clave, idioma: 'en', slug: slug ?? null });
    });
  }

  it('una ruta desconocida devuelve null', () => {
    assert.equal(rutaBase('/inexistente'), null);
    assert.equal(rutaBase('/artistas/ruben-mavarez/obra'), null);
  });
});

describe('rutasAlternativas', () => {
  it('arma el par para el selector y los hreflang', () => {
    assert.deepEqual(rutasAlternativas('/en/artists/ruben-mavarez'), {
      es: '/artistas/ruben-mavarez',
      en: '/en/artists/ruben-mavarez',
    });
    assert.deepEqual(rutasAlternativas('/'), { es: '/', en: '/en/' });
  });
});
