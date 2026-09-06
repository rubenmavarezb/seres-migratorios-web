// @ts-check
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

// NOTE: eslint-plugin-astro resolved to 1.7.0 (not 3.1.x) because its 3.x line
// requires eslint >=10, while eslint-plugin-jsx-a11y (a required peer here)
// only supports up to eslint ^9 — see the OBSERVACIÓN in the SM-007 report.
// The config shape below (`configs.recommended`, `configs['jsx-a11y-recommended']`)
// was verified by reading node_modules/eslint-plugin-astro/README.md and
// lib/index.mjs for the version actually installed.
//
// Uses ESLint core's `defineConfig()` (eslint/config) rather than
// `tseslint.config()`: the latter is marked @deprecated in the installed
// typescript-eslint (8.69.0) in favor of this exact replacement, which
// supports the same `{ files, extends }` shorthand used below.
export default defineConfig(
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'design/',
      'docs/capturas/',
      'playwright-report/',
      'test-results/',
    ],
  },
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommended],
  }
);
