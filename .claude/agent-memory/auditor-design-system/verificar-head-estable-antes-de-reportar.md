---
name: verificar-head-estable-antes-de-reportar
description: Re-correr git diff --stat justo antes de redactar el reporte final, porque el HEAD del branch auditado puede avanzar a mitad de la auditoría (agentes o commits concurrentes) y dejar hunks sin revisar.
metadata:
  type: feedback
---

En una auditoría de la rama `claude/funny-boyd-fcb6fc` (Fase 3), el primer `git diff origin/main...HEAD --stat` tomado al arrancar no incluía `src/components/Pie.astro` ni el hunk de `SM-047` dentro de `Home.astro`; unos minutos después, el mismo comando sí los mostraba porque el commit `e728c0c` (SM-047) había aterrizado en el medio.

**Por qué**: el advisor lo detectó comparando dos corridas del mismo stat y notó que los deltas coincidían exactamente con el footprint de un commit nuevo. Sin ese chequeo, el diff de `Home.astro` que reporté como "limpio" habría estado incompleto (le faltaba el hunk de `apoyar.linkMercadoPago`).

**Cómo aplicar**: en cualquier auditoría de una rama activa, correr `git rev-parse HEAD` al principio y otra vez justo antes de escribir el reporte final; si cambió, repetir el `git diff --stat` y re-revisar los archivos cuyo conteo de líneas cambió antes de cerrar el hallazgo. Construir la lista de archivos a grepear con `git diff origin/main...HEAD --name-only`, nunca a mano, para que no quede desactualizada si el HEAD se movió.
