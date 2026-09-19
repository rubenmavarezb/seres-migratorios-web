import { defineConfig, devices } from '@playwright/test';

// Minimal ambient declaration for the one Node global this file needs.
// `@types/node` is not in the approved dependency list (see SM-007 report),
// so this describes only the shape actually used instead of pulling in the
// full Node type surface. Declared at module scope (not `declare global`) so
// it shadows rather than clashes with `@types/node`'s `declare var process`
// if a future task (e.g. @axe-core/playwright in SM-059) pulls it in
// transitively — a global redeclaration would break `astro check` (TS2451).
declare const process: { env: { CI?: string } };

// Playwright config for SM-007; the smoke specs themselves live in
// `tests/e2e/*.spec.ts` since SM-059. The directory is explicit (SM-045) so
// the runner never picks up the Node unit tests that live in
// `tests/unitarias/`.
//
// `forbidOnly` fails the build if a `.only` is ever committed — CI-only,
// since a `.only` left while debugging locally should not also break `npm
// test` there. `retries: 0` everywhere: a smoke suite that needs a retry to
// go green is not deterministic, which SM-059's design explicitly asks this
// suite to be. `reducedMotion: 'reduce'` matches every real visitor Base.css's
// `@media (prefers-reduced-motion: no-preference)` block excludes: the DS §11
// scroll entrances (`data-entrada`) would otherwise leave elements mid-`opacity`
// when a test's `waitFor`/assertion lands inside their animation window.
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
