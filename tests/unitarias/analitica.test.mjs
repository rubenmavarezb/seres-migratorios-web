// Unit tests for the shared analytics gates of `src/analitica.ts` (SM-065).
//
// Same convention as `rutas.test.mjs`: `analitica.ts` imports nothing, so
// Node's built-in test runner strips its types and runs it directly, no
// bundler involved.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  RUTAS_EXCLUIDAS_DE_ANALITICA,
  estaExcluidaDeAnalitica,
  sinBarraFinal,
  tokenDeAnalyticsValido,
} from '../../src/analitica.ts';

describe('RUTAS_EXCLUIDAS_DE_ANALITICA', () => {
  it('es exactamente /kit, /gracias y /en/thanks', () => {
    assert.deepEqual([...RUTAS_EXCLUIDAS_DE_ANALITICA], ['/kit', '/gracias', '/en/thanks']);
  });
});

describe('sinBarraFinal', () => {
  it('conserva la raíz como "/"', () => {
    assert.equal(sinBarraFinal('/'), '/');
  });

  it('quita la barra final de build.format: directory', () => {
    assert.equal(sinBarraFinal('/gracias/'), '/gracias');
    assert.equal(sinBarraFinal('/en/thanks/'), '/en/thanks');
  });

  it('deja igual una ruta sin barra final', () => {
    assert.equal(sinBarraFinal('/kit'), '/kit');
  });
});

describe('estaExcluidaDeAnalitica', () => {
  for (const ruta of ['/kit', '/gracias', '/en/thanks']) {
    it(`"${ruta}" está excluida`, () => {
      assert.equal(estaExcluidaDeAnalitica(ruta), true);
    });

    it(`"${ruta}/" (build.format: directory) también está excluida`, () => {
      assert.equal(estaExcluidaDeAnalitica(`${ruta}/`), true);
    });
  }

  for (const ruta of ['/', '/manifiesto', '/artistas', '/en/', '/en/manifesto', '/apoyar']) {
    it(`"${ruta}" NO está excluida`, () => {
      assert.equal(estaExcluidaDeAnalitica(ruta), false);
    });
  }
});

describe('tokenDeAnalyticsValido', () => {
  it('rechaza undefined', () => {
    assert.equal(tokenDeAnalyticsValido(undefined), false);
  });

  it('rechaza el string vacío', () => {
    assert.equal(tokenDeAnalyticsValido(''), false);
  });

  it('rechaza un valor solo de espacios', () => {
    assert.equal(tokenDeAnalyticsValido('   '), false);
  });

  it('rechaza el placeholder entre corchetes de .env.example', () => {
    assert.equal(tokenDeAnalyticsValido('[TOKEN CLOUDFLARE ANALYTICS]'), false);
  });

  it('rechaza cualquier valor entre corchetes', () => {
    assert.equal(tokenDeAnalyticsValido('[X]'), false);
  });

  it('rechaza un valor que no es string', () => {
    assert.equal(tokenDeAnalyticsValido(123), false);
    assert.equal(tokenDeAnalyticsValido(null), false);
  });

  it('acepta un token real, con o sin espacios alrededor', () => {
    assert.equal(tokenDeAnalyticsValido('prueba123'), true);
    assert.equal(tokenDeAnalyticsValido('  prueba123  '), true);
  });
});
