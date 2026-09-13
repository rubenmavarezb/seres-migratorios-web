// Unit tests for the SM-061 page-weight budget gate
// (`scripts/presupuesto-peso.mjs`): the pure parsing/summing logic, exercised
// against in-memory HTML strings and small `mkdtemp` fixture trees so no real
// `dist/` build is required to run these.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import {
  LIMITE_BYTES,
  LIMITE_KB,
  NIVEL_GZIP,
  calcularPesoDePagina,
  esUrlExterna,
  esUrlInline,
  evaluarPresupuesto,
  extraerReferenciasLocales,
  generarTabla,
  listarPaginasHtml,
  resolverRutaDist,
} from '../../scripts/presupuesto-peso.mjs';

const RUTA_SCRIPT = fileURLToPath(new URL('../../scripts/presupuesto-peso.mjs', import.meta.url));

/** Builds a temp `dist/`-shaped tree and returns its path; caller must clean it up. */
function crearDist() {
  const dir = mkdtempSync(join(tmpdir(), 'sm-presupuesto-'));
  mkdirSync(join(dir, '_astro'), { recursive: true });
  mkdirSync(join(dir, 'artistas'), { recursive: true });
  return dir;
}

describe('extraerReferenciasLocales', () => {
  it('picks up a local stylesheet and a local module script, in order, de-duplicated', () => {
    const html = `<!doctype html><html><head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="canonical" href="https://seresmigratorios.com/">
      <link rel="stylesheet" href="/_astro/Base.BdR4mKTz.css">
      <link rel="stylesheet" href="/_astro/Base.BdR4mKTz.css">
    </head><body>
      <script type="module" src="/_astro/entrada.abc123.js"></script>
      <script type="module">console.log('inline, no src, not a reference')</script>
    </body></html>`;

    assert.deepEqual(extraerReferenciasLocales(html), [
      '/_astro/Base.BdR4mKTz.css',
      '/_astro/entrada.abc123.js',
    ]);
  });

  it('follows modulepreload links too', () => {
    const html = `<link rel="modulepreload" href="/_astro/chunk.xyz.js">`;
    assert.deepEqual(extraerReferenciasLocales(html), ['/_astro/chunk.xyz.js']);
  });

  it('ignores anchors and every non stylesheet/modulepreload link', () => {
    const html = `<a href="#contenido">Saltar</a><link rel="alternate" hreflang="en-US" href="/en/">`;
    assert.deepEqual(extraerReferenciasLocales(html), []);
  });
});

describe('esUrlExterna / esUrlInline', () => {
  it('classifies absolute http(s) and protocol-relative URLs as external', () => {
    assert.equal(esUrlExterna('https://fonts.gstatic.com/x.woff2'), true);
    assert.equal(esUrlExterna('http://example.com/x.css'), true);
    assert.equal(esUrlExterna('//fonts.gstatic.com/x.woff2'), true);
    assert.equal(esUrlExterna('/_astro/Base.css'), false);
  });

  it('classifies data: URIs as inline, not external and not local', () => {
    assert.equal(esUrlInline('data:image/svg+xml;base64,AAAA'), true);
    assert.equal(esUrlExterna('data:image/svg+xml;base64,AAAA'), false);
  });
});

describe('resolverRutaDist', () => {
  it('resolves a root-absolute reference against the dist directory', () => {
    assert.equal(
      resolverRutaDist('/repo/dist', '/_astro/Base.BdR4mKTz.css'),
      join('/repo/dist', '_astro', 'Base.BdR4mKTz.css')
    );
  });

  it('strips query string and fragment before resolving', () => {
    assert.equal(
      resolverRutaDist('/repo/dist', '/_astro/Base.css?v=2#foo'),
      join('/repo/dist', '_astro', 'Base.css')
    );
  });
});

describe('calcularPesoDePagina / listarPaginasHtml (mkdtemp fixtures)', () => {
  it('sums HTML + local CSS gzip and raw bytes, and lists external resources without counting them', () => {
    const dist = crearDist();
    try {
      const css = 'body{color:red}'.repeat(50);
      writeFileSync(join(dist, '_astro', 'Base.css'), css);
      // `preconnect` is a hint, not a fetched resource, so it must stay out of
      // `externos` entirely (see `extraerReferenciasLocales`); an external
      // `rel="stylesheet"` is a real (if currently hypothetical, per the
      // Lighthouse diagnosis' fix (b)) fetched-and-not-counted case.
      const html = `<!doctype html><head>
        <link rel="stylesheet" href="/_astro/Base.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton">
      </head><body>hola</body>`;
      writeFileSync(join(dist, 'index.html'), html);

      assert.deepEqual(listarPaginasHtml(dist), ['index.html']);

      const resultado = calcularPesoDePagina(dist, 'index.html');
      const brutoEsperado = Buffer.byteLength(html) + Buffer.byteLength(css);
      const gzipEsperado =
        gzipSync(Buffer.from(html), { level: 9 }).length +
        gzipSync(Buffer.from(css), { level: 9 }).length;

      assert.equal(resultado.brutoBytes, brutoEsperado);
      assert.equal(resultado.gzipBytes, gzipEsperado);
      assert.deepEqual(resultado.rotas, []);
      assert.deepEqual(resultado.externos, ['https://fonts.googleapis.com/css2?family=Anton']);
      assert.ok(resultado.gzipBytes < LIMITE_BYTES);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('finds *.html recursively under nested route directories', () => {
    const dist = crearDist();
    try {
      writeFileSync(join(dist, 'index.html'), '<p>a</p>');
      writeFileSync(join(dist, 'artistas', 'index.html'), '<p>b</p>');
      writeFileSync(join(dist, '_astro', 'Base.css'), 'body{}'); // not .html, must be ignored

      assert.deepEqual(listarPaginasHtml(dist), ['artistas/index.html', 'index.html']);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('reports a broken local reference instead of throwing, and does not count it towards the weight', () => {
    const dist = crearDist();
    try {
      const html = `<link rel="stylesheet" href="/_astro/no-existe.css">contenido`;
      writeFileSync(join(dist, 'index.html'), html);

      const resultado = calcularPesoDePagina(dist, 'index.html');

      assert.deepEqual(resultado.rotas, ['/_astro/no-existe.css']);
      assert.equal(resultado.brutoBytes, Buffer.byteLength(html));
      assert.equal(resultado.gzipBytes, gzipSync(Buffer.from(html), { level: 9 }).length);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('flags a page whose HTML+CSS exceeds the 120 KB gzip budget', () => {
    const dist = crearDist();
    try {
      // Fixed absolute size (122880 + 4096 bytes), NOT derived from the
      // imported LIMITE_BYTES: if it were `LIMITE_BYTES + 4096`, a mutation
      // that inflates LIMITE_KB/LIMITE_BYTES would inflate this fixture right
      // along with it and the test would keep passing no matter how high the
      // budget was raised. Random-ish, barely-compressible content so its
      // gzip size stays close to its raw size.
      const pesado = Buffer.from(
        Array.from({ length: 122880 + 4096 }, () => Math.floor(Math.random() * 256))
      );
      writeFileSync(join(dist, '_astro', 'pesado.css'), pesado);
      const html = `<link rel="stylesheet" href="/_astro/pesado.css">contenido`;
      writeFileSync(join(dist, 'index.html'), html);

      const resultado = calcularPesoDePagina(dist, 'index.html');

      assert.deepEqual(resultado.rotas, []);
      // Asserted against the literal 120 KB (122880 bytes), not the imported
      // LIMITE_BYTES, for the same reason: the point of this test is that
      // *this* fixture — sized independently of the constant — reliably
      // produces a gzip total over the documented budget.
      assert.ok(
        resultado.gzipBytes > 122880,
        `esperaba gzipBytes > 122880, dio ${resultado.gzipBytes}`
      );
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('de-duplicates a resource referenced twice on the same page', () => {
    const dist = crearDist();
    try {
      const css = 'body{color:blue}';
      writeFileSync(join(dist, '_astro', 'Base.css'), css);
      const html = `<link rel="stylesheet" href="/_astro/Base.css"><link rel="stylesheet" href="/_astro/Base.css">`;
      writeFileSync(join(dist, 'index.html'), html);

      const resultado = calcularPesoDePagina(dist, 'index.html');
      const brutoEsperado = Buffer.byteLength(html) + Buffer.byteLength(css);

      assert.equal(resultado.brutoBytes, brutoEsperado);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
});

describe('budget constants (pinned)', () => {
  it('documents the SM-061 budget as exactly 120 KB, gzip level 9', () => {
    // Pinned against literals, not against each other, so a change to any of
    // these three exported constants — the KB figure, the byte conversion
    // (e.g. ×1000 instead of ×1024), or the gzip level — is caught here
    // directly instead of silently passing every other test that only
    // compares a result to the (now-changed) imported constant.
    assert.equal(LIMITE_KB, 120);
    assert.equal(LIMITE_BYTES, 122880);
    assert.equal(NIVEL_GZIP, 9);
  });
});

describe('generarTabla', () => {
  const liviana = {
    rutaPagina: 'liviana.html',
    brutoBytes: 100,
    gzipBytes: 100,
    externos: [],
    rotas: [],
  };
  const media = {
    rutaPagina: 'media.html',
    brutoBytes: 5000,
    gzipBytes: 4000,
    externos: [],
    rotas: [],
  };
  const pesada = {
    rutaPagina: 'pesada.html',
    brutoBytes: 200000,
    gzipBytes: 122881,
    externos: [],
    rotas: [],
  };

  it('sorts rows heaviest (gzip) first regardless of input order, and names that page in the summary line', () => {
    const tabla = generarTabla([liviana, pesada, media]);
    const filas = tabla.split('\n');
    const indicePesada = filas.findIndex((f) => f.includes('pesada.html'));
    const indiceMedia = filas.findIndex((f) => f.includes('media.html'));
    const indiceLiviana = filas.findIndex((f) => f.includes('liviana.html'));

    // Every row appears, and in descending gzip order.
    assert.ok(indicePesada < indiceMedia && indiceMedia < indiceLiviana, tabla);
    assert.match(tabla, /Máximo: pesada\.html/);
  });

  it('marks a page over the 122880-byte budget with the EXCEDE warning, and not a page under it', () => {
    const tabla = generarTabla([liviana, pesada]);
    const filaPesada = tabla.split('\n').find((f) => f.includes('pesada.html'));
    const filaLiviana = tabla.split('\n').find((f) => f.includes('liviana.html'));

    assert.match(filaPesada, /EXCEDE/);
    assert.doesNotMatch(filaLiviana, /EXCEDE/);
  });

  it('reports "sin páginas" when given an empty result set, instead of throwing', () => {
    assert.match(generarTabla([]), /Sin páginas HTML en dist\/\./);
  });
});

describe('evaluarPresupuesto (pure decision logic)', () => {
  it('passes when every page is under budget and has no broken reference', () => {
    const pagina = { rutaPagina: 'a.html', brutoBytes: 10, gzipBytes: 10, externos: [], rotas: [] };
    const evaluacion = evaluarPresupuesto([pagina]);
    assert.deepEqual(evaluacion.queExceden, []);
    assert.deepEqual(evaluacion.conReferenciasRotas, []);
    assert.equal(evaluacion.ok, true);
  });

  it('flags a page at exactly 122881 bytes gzip (one over the literal 120 KB budget) and fails the run', () => {
    // Asserted against the literal 122880/122881, not the imported
    // LIMITE_BYTES: this is the test that actually exercises the threshold
    // comparison inside evaluarPresupuesto, so a mutation that raises
    // LIMITE_KB (e.g. to 1200) makes this fixture's 122881 bytes fall back
    // under the (now much higher) budget and queExceden comes back empty —
    // the assertion below then fails, catching the mutation.
    //
    // brutoBytes is deliberately tiny and unrelated to gzipBytes: it pins the
    // check to gzip specifically, so a mutation that compares brutoBytes
    // instead (e.g. checking raw size against the budget) reads 50 — well
    // under budget — and queExceden comes back empty, failing this test.
    const pagina = {
      rutaPagina: 'pesada.html',
      brutoBytes: 50,
      gzipBytes: 122881,
      externos: [],
      rotas: [],
    };
    const sana = {
      rutaPagina: 'sana.html',
      brutoBytes: 10,
      gzipBytes: 10,
      externos: [],
      rotas: [],
    };
    const evaluacion = evaluarPresupuesto([sana, pagina]);
    assert.deepEqual(evaluacion.queExceden, [pagina]);
    assert.deepEqual(evaluacion.conReferenciasRotas, []);
    assert.equal(evaluacion.ok, false);
  });

  it('does not flag a page at exactly the 122880-byte budget (over, not at, fails)', () => {
    const pagina = {
      rutaPagina: 'al-limite.html',
      brutoBytes: 122880,
      gzipBytes: 122880,
      externos: [],
      rotas: [],
    };
    const evaluacion = evaluarPresupuesto([pagina]);
    assert.deepEqual(evaluacion.queExceden, []);
    assert.equal(evaluacion.ok, true);
  });

  it('flags a page with a broken local reference and fails the run even when its weight is fine', () => {
    const pagina = {
      rutaPagina: 'rota.html',
      brutoBytes: 10,
      gzipBytes: 10,
      externos: [],
      rotas: ['/_astro/no-existe.css'],
    };
    const evaluacion = evaluarPresupuesto([pagina]);
    assert.deepEqual(evaluacion.queExceden, []);
    assert.deepEqual(evaluacion.conReferenciasRotas, [pagina]);
    assert.equal(evaluacion.ok, false);
  });
});

describe('CLI (spawnSync end to end)', () => {
  /** Runs `node scripts/presupuesto-peso.mjs <basename(dist)>` with cwd set so the relative arg resolves to `dist`. */
  function correrCli(dist) {
    return spawnSync(process.execPath, [RUTA_SCRIPT, basename(dist)], {
      cwd: dirname(dist),
      encoding: 'utf8',
    });
  }

  it('exits 0 for a page that is well under budget', () => {
    const dist = crearDist();
    try {
      const css = 'body{color:red}'.repeat(20); // small and highly compressible
      writeFileSync(join(dist, '_astro', 'Base.css'), css);
      writeFileSync(
        join(dist, 'index.html'),
        `<link rel="stylesheet" href="/_astro/Base.css">hola`
      );

      const resultado = correrCli(dist);

      assert.equal(resultado.status, 0, resultado.stdout + resultado.stderr);
      assert.match(resultado.stdout, /OK/);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('exits 1 for a page whose gzip total exceeds the budget', () => {
    const dist = crearDist();
    try {
      const pesado = Buffer.from(
        Array.from({ length: 122880 + 4096 }, () => Math.floor(Math.random() * 256))
      );
      writeFileSync(join(dist, '_astro', 'pesado.css'), pesado);
      writeFileSync(
        join(dist, 'index.html'),
        `<link rel="stylesheet" href="/_astro/pesado.css">hola`
      );

      const resultado = correrCli(dist);

      assert.equal(resultado.status, 1, resultado.stdout + resultado.stderr);
      assert.match(resultado.stderr, /exceden/);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('exits 1 for a page with a broken local reference', () => {
    const dist = crearDist();
    try {
      writeFileSync(
        join(dist, 'index.html'),
        `<link rel="stylesheet" href="/_astro/no-existe.css">hola`
      );

      const resultado = correrCli(dist);

      assert.equal(resultado.status, 1, resultado.stdout + resultado.stderr);
      assert.match(resultado.stderr, /rotas/);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
});
