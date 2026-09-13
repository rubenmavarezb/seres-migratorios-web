/**
 * Whether this test run targets a build where the open call
 * (`src/content/convocatorias/edicion-02.md`) was flipped to `abierta: true`.
 *
 * The CI job rebuilds with that field patched and re-runs
 * `npx playwright test --grep @abierta` with this variable set to `1`; every
 * other run (locally with a closed build, and the first CI pass) leaves it
 * unset. Specs read this single boolean instead of `process.env` directly.
 */
export const CONVOCATORIA_ABIERTA = process.env.CONVOCATORIA_ABIERTA === '1';
