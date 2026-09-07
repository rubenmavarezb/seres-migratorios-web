# Bug Detector - Agent Memory

This file maintains persistent memory for the bug-detector agent across sessions.

## Purpose
Track bug patterns, common mistakes, and project-specific correctness requirements.

---

## Framework Error Handling Standards

**Note:** These standards are also defined in the global `.claude/CLAUDE.md` file. They are duplicated here for the bug-detector agent's reference during bug detection.

### Error Handling Requirements
**Always check for:**
- ✅ Errors handled explicitly (no silent failures)
- ✅ Typed errors or structured error objects (where language supports it)
- ✅ Meaningful error messages with context
- ❌ Empty catch blocks that swallow errors
- ❌ Exceptions swallowed to make tests pass
- ❌ Silent failures that hide problems

**Example - Good:**
```javascript
try {
  await processPayment(order);
} catch (error) {
  logger.error('Payment processing failed', { orderId: order.id, error });
  throw new PaymentError('Unable to process payment', { cause: error });
}
```

**Example - Bad:**
```javascript
try {
  await processPayment(order);
} catch (error) {
  // Silent failure - error is lost
}
```

---

## Framework Testing Standards

**Note:** These standards are also defined in the global `.claude/CLAUDE.md` file. They are duplicated here for the bug-detector agent's reference during testing validation.

### Test Writing Requirements
**Standards:**
- ✅ Write tests alongside new code (not as afterthought)
- ✅ Write unit tests for business logic
- ✅ Test behavior, not implementation
- ✅ Mock external services (payment gateways, APIs) to avoid side effects
- ❌ NEVER delete, skip, or comment out existing tests to make new code pass
- ❌ If a test fails, fix the code or flag the conflict

### Bug Fix Testing
**For every bug fix:**
1. Write a test that **fails** before the fix
2. Apply the fix
3. Verify the test **passes** after the fix
4. Ensure regression prevention

### Test Coverage Standards
**Minimum expectations:**
- ✅ Happy path (successful case)
- ✅ At least one failure/edge case
- ✅ Meaningful coverage of critical paths (not just high percentages)
- ✅ Run relevant tests before declaring task complete
- ✅ Report test results

### External Service Testing
**Requirements:**
- ✅ Mock payment gateways (Stripe, PayPal, etc.)
- ✅ Mock external APIs
- ✅ Avoid side effects in tests
- ✅ Use test/sandbox environments only

---

## Project-Specific Bug Patterns

### Common Bug Patterns in This Project
<!-- Document recurring bug types found -->
<!-- Example: Forgetting to check null on API responses -->

### Framework Guarantees
<!-- Note what the framework/type system prevents -->
<!-- Example: TypeScript prevents type mismatches at compile time -->

### Edge Cases to Always Check
<!-- Project-specific edge cases based on domain -->
<!-- Example: Always check for empty arrays in e-commerce cart logic -->

### Past Bugs Found
<!-- High-level notes on bugs discovered and fixed -->
<!-- Example: 2024-01-15 - Race condition in order processing -->

### Testing Gaps
<!-- Areas lacking test coverage that led to bugs -->
<!-- Example: Payment retry logic not covered by tests -->

### Language/Framework Specific Gotchas
<!-- Platform-specific issues to watch for -->
<!-- Example: JavaScript null vs undefined behavior -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- TypeScript estricto (`astro/tsconfigs/strict`): nada de `any`. Si un tipo no cierra, se arregla el tipo, no se silencia.
- `t()` en `src/i18n/utils.ts` cae al valor de `es.json` en silencio cuando falta la clave en `en.json`; `ClaveDeTexto` se deriva solo de `es.json`. El test real es `scripts/i18n-paridad.mjs` (`npm run test:i18n`).
- `src/i18n/rutas.ts` no importa nada a propósito: corre bajo `node --test` con type stripping. Un import ahí rompe `tests/unitarias/rutas.test.mjs`.
- `astro.config.mjs` usa `||`, no `??`, para `PUBLIC_SITE_URL`: `loadEnv` devuelve cadena vacía para una variable declarada y vacía.
- `build.format: 'directory'` emite `/gracias/`; toda comparación de rutas normaliza la barra final (ver `sinBarraFinal` y `normalizar`).
- Hay una sola edición con `estado: proxima` a la vez; si aparece una segunda, la `BloqueFicha` del home es ambigua.
- Un valor `[ENTRE CORCHETES]` es contenido VÁLIDO en zod (`oPlaceholder`): no es un bug, es un placeholder pendiente. El dominio `seresmigratorios.com` nunca es placeholder.
- El formulario de convocatoria valida nativo sin JS; con JS solo agrega mensajes. No exigir que la validación dependa del script.
