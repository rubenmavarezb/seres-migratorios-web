import { defineConfig, devices } from '@playwright/test';

// Minimal ambient declaration for the one Node global this file needs.
// `@types/node` is not in the approved dependency list (see SM-007 report),
// so this describes only the shape actually used instead of pulling in the
// full Node type surface. Declared at module scope (not `declare global`) so
// it shadows rather than clashes with `@types/node`'s `declare var process`
// if a future task (e.g. @axe-core/playwright in SM-059) pulls it in
// transitively — a global redeclaration would break `astro check` (TS2451).
declare const process: { env: { CI?: string } };

// Minimal Playwright config for SM-007. Tests themselves land in SM-059;
// `tests/e2e/` only carries a .gitkeep for now so this config has somewhere to
// point. The directory is explicit (SM-045) so the runner never picks up the
// Node unit tests that live in `tests/unitarias/`.
export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:4321',
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
