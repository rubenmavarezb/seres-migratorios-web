import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('Campo.nombre is technical; Campo.etiqueta and FichaFotografo.nombre remain audited', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sm-textos-'));
  const file = join(dir, 'prueba.astro');
  try {
    for (const [source, expected] of [
      [
        '<Campo nombre="consentimiento" etiqueta={t(idioma, "formulario.etiquetas.consentimiento")} />',
        0,
      ],
      ['<Campo nombre="email" etiqueta="Correo electrónico" />', 1],
      ['<FichaFotografo nombre="Nombre inventado" />', 1],
    ]) {
      writeFileSync(file, source);
      const result = spawnSync(process.execPath, ['scripts/texto-hardcodeado.mjs', file], {
        encoding: 'utf8',
      });
      assert.equal(result.status, expected, result.stderr);
    }
  } finally {
    unlinkSync(file);
    rmdirSync(dir);
  }
});
