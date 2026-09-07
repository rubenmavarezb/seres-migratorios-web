// Unit tests for the edition helpers of `src/components/internos/ediciones.ts`
// (SM-039 / SM-040 / SM-041).
//
// Runs on Node's built-in test runner with no dependencies: Node 22.22 strips
// the types of the imported `.ts` module on its own. That is why that module
// imports nothing — see its header.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ZONA_BUENOS_AIRES,
  direccionSinCiudad,
  esPlaceholder,
  etiquetaCortaDeEdicion,
  fechaCorta,
  fechaHoraIso,
  fechaIso,
  rangoDeSets,
  retratoTamano,
  urlDeInstagram,
} from '../../src/components/internos/ediciones.ts';

/**
 * The date of edición 01 exactly as `content.config.ts` produces it:
 * `z.coerce.date()` on the string `2026-08-08` yields that day's UTC midnight.
 * Read with local getters in Buenos Aires (UTC-3) the same instant is the 7th at
 * 21:00, so every assertion below is also a regression test against a
 * local-time slip.
 */
const EDICION_01 = new Date('2026-08-08');

describe('fechaCorta', () => {
  it('formatea dd.mm.aaaa como el BloqueFicha de la lámina', () => {
    assert.equal(fechaCorta(EDICION_01), '08.08.2026');
  });

  it('no se corre un día por la zona horaria local', () => {
    // UTC midnight of the 1st: the risk case for a negative local offset.
    assert.equal(fechaCorta(new Date('2026-01-01')), '01.01.2026');
    assert.equal(fechaCorta(new Date('2026-12-31')), '31.12.2026');
  });

  it('rellena con cero día y mes de un dígito', () => {
    assert.equal(fechaCorta(new Date('2026-03-05')), '05.03.2026');
  });
});

describe('fechaIso', () => {
  it('devuelve la mitad de fecha de un ISO 8601', () => {
    assert.equal(fechaIso(EDICION_01), '2026-08-08');
    assert.equal(fechaIso(new Date('2026-01-01')), '2026-01-01');
  });
});

describe('fechaHoraIso', () => {
  it('compone startDate y endDate en la zona de Buenos Aires', () => {
    assert.equal(fechaHoraIso(EDICION_01, '10:00'), '2026-08-08T10:00:00-03:00');
    assert.equal(fechaHoraIso(EDICION_01, '19:00'), '2026-08-08T19:00:00-03:00');
  });

  it('usa el desplazamiento fijo -03:00', () => {
    assert.equal(ZONA_BUENOS_AIRES, '-03:00');
    assert.ok(fechaHoraIso(EDICION_01, '10:00').endsWith(ZONA_BUENOS_AIRES));
  });

  it('produce un instante que Date vuelve a parsear igual', () => {
    const iso = fechaHoraIso(EDICION_01, '10:00');
    assert.equal(new Date(iso).toISOString(), '2026-08-08T13:00:00.000Z');
  });
});

describe('etiquetaCortaDeEdicion', () => {
  it('recorta en el guion largo del nombre real', () => {
    assert.equal(etiquetaCortaDeEdicion('Edición 01 — Buenos Aires'), 'Edición 01');
  });

  it('devuelve el nombre completo cuando no hay separador', () => {
    assert.equal(etiquetaCortaDeEdicion('Edición 02'), 'Edición 02');
  });

  it('nunca devuelve vacío', () => {
    assert.equal(etiquetaCortaDeEdicion('— Buenos Aires'), '— Buenos Aires');
  });
});

describe('direccionSinCiudad', () => {
  it('quita la cola de ciudad que el contenido ya trae', () => {
    assert.equal(
      direccionSinCiudad('Humberto Primo 3032, Buenos Aires, ARG', 'Buenos Aires'),
      'Humberto Primo 3032'
    );
  });

  it('deja intacta una dirección sin la ciudad', () => {
    assert.equal(direccionSinCiudad('Humberto Primo 3032', 'Buenos Aires'), 'Humberto Primo 3032');
  });

  it('no devuelve vacío si la dirección es solo la ciudad', () => {
    assert.equal(direccionSinCiudad(', Buenos Aires', 'Buenos Aires'), ', Buenos Aires');
  });
});

describe('rangoDeSets', () => {
  it('da el primero y el último número de los sets', () => {
    const numeros = ['001', '002', '003', '004', '005', '006', '007'];
    assert.deepEqual(rangoDeSets(numeros), { desde: '001', hasta: '007' });
  });

  it('ordena antes de tomar los extremos', () => {
    assert.deepEqual(rangoDeSets(['004', '001', '007']), { desde: '001', hasta: '007' });
  });

  it('ignora a quien no tiene número', () => {
    assert.deepEqual(rangoDeSets([undefined, '002', undefined, '005']), {
      desde: '002',
      hasta: '005',
    });
  });

  it('devuelve null cuando nadie tiene número, para no inventar un rango', () => {
    assert.equal(rangoDeSets([undefined, undefined]), null);
    assert.equal(rangoDeSets([]), null);
  });
});

describe('retratoTamano', () => {
  it('reproduce el retratoChico [72, 90] de la lámina', () => {
    // herick-frontado.png 376×471, andrea-cubillan.png 262×327.
    assert.deepEqual(retratoTamano(376, 471), [72, 90]);
    assert.deepEqual(retratoTamano(262, 327), [72, 90]);
  });

  it('reproduce el retratoCuadrado [72, 72] de Pati Caro', () => {
    assert.deepEqual(retratoTamano(114, 114), [72, 72]);
  });

  it('cae al alto por defecto con medidas inválidas', () => {
    assert.deepEqual(retratoTamano(0, 0), [72, 90]);
  });
});

describe('esPlaceholder', () => {
  it('reconoce un placeholder entre corchetes', () => {
    assert.equal(esPlaceholder('[HANDLE MAVAREZ]'), true);
  });

  it('trata un valor ausente como placeholder', () => {
    assert.equal(esPlaceholder(undefined), true);
  });

  it('acepta un handle real', () => {
    assert.equal(esPlaceholder('@rawmses'), false);
  });
});

describe('urlDeInstagram', () => {
  it('arma el perfil público desde el handle con arroba', () => {
    assert.equal(urlDeInstagram('@rawmses'), 'https://www.instagram.com/rawmses/');
    assert.equal(urlDeInstagram('@consulado.ba'), 'https://www.instagram.com/consulado.ba/');
  });
});
