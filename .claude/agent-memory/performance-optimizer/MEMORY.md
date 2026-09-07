# Performance Optimizer - Agent Memory

This file maintains persistent memory for the performance-optimizer agent across sessions.

## Purpose
Track performance bottlenecks, optimizations made, and performance requirements.

---

## Framework Performance Standards

**Note:** These standards are also defined in the global `.claude/CLAUDE.md` file. They are duplicated here for the performance-optimizer agent's reference during performance analysis.

### General Performance Principles
- **Readable first**, optimized second
- Don't optimize prematurely — profile first, optimize second
- Focus on actual bottlenecks, not theoretical improvements
- Consider the trade-off between performance and maintainability

### Performance Issues to Flag
**Always check for:**
- ❌ Unnecessary re-renders or redundant computations
- ❌ Inappropriate data structures (array lookup instead of Map/Set)
- ❌ N+1 database queries
- ❌ Unnecessary loops or nested loops
- ❌ Synchronous operations blocking async flows
- ✅ Use appropriate data structures for the task
- ✅ Consider lazy loading for large assets or data sets

### Observability Standards
**Logging for Performance:**
- ✅ Log meaningful context with errors
- ✅ Log timing metrics to identify bottlenecks
- ✅ Use structured logging for easy analysis
- ❌ Don't log sensitive data (see Security Standards)

**Example - Performance Logging:**
```javascript
const startTime = Date.now();
await processLargeDataset(data);
const duration = Date.now() - startTime;
logger.info('Dataset processing completed', {
  recordCount: data.length,
  durationMs: duration
});
```

### Common Performance Patterns
**Database:**
- Use eager loading to avoid N+1 queries
- Add indexes for frequently queried columns
- Paginate large result sets
- Use connection pooling

**Frontend:**
- Memoize expensive computations
- Virtualize long lists
- Code split and lazy load
- Debounce/throttle frequent operations

**Algorithms:**
- Choose appropriate time complexity (O(n) over O(n²))
- Use caching for repeated expensive operations
- Consider streaming for large data processing

---

## Project-Specific Performance

### Performance Requirements
<!-- Document SLAs, response time targets, throughput needs -->
<!-- Example: API responses < 200ms, page load < 2s -->

### Past Bottlenecks
<!-- Performance issues identified and resolved -->
<!-- Example: 2024-01-15 - Fixed N+1 query in order listing (100ms → 10ms) -->

### Optimization History
<!-- Optimizations made and their measured impact -->
<!-- Example: Added Redis caching for user sessions (50% latency reduction) -->

### Hot Paths
<!-- Critical code paths that need to be fast -->
<!-- Example: Checkout flow, search results, dashboard loading -->

### Caching Strategy
<!-- Current caching approach and what's cached -->
<!-- Example: Redis for session data (TTL 1h), CloudFront for static assets -->

### Database Indexes
<!-- Indexes added for performance -->
<!-- Example: Index on users.email, orders.user_id, products.category_id -->

### Known Performance Limitations
<!-- Accepted performance constraints with reasoning -->
<!-- Example: Report generation intentionally slow to avoid database overload -->

### Monitoring & Profiling
<!-- Performance monitoring setup and key metrics -->
<!-- Example: Datadog APM tracking p95 latency, Sentry performance monitoring -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Toda imagen pasa por `astro:assets` con sharp. Hero: `<Picture>` con `priority` y AVIF/WebP. El resto `loading="lazy"` con `widths` y `sizes` explícitos.
- Límites de origen: obra ≤ 2400 px de lado largo, retratos 800 px, escaneos de letra en SVG o PNG transparente.
- Sin frameworks de UI ni librerías de animación; JS de cliente solo Lightbox y validación del formulario. No proponer islas, bundlers ni CDNs.
- Estático en Netlify, sin adapter: no hay SSR ni caché de servidor que optimizar. `compressHTML: true` es deliberado (ver `docs/notas-astro-7.md`).
- Fuentes web: las tres del `@theme`. Cualquier fuente extra o `@import` remoto es hallazgo.
