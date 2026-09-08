---
name: pre-pr
description: 'Revisar si los cambios de Seres Migratorios están listos para un PR: checks de CI, diseño, bilingüismo y pendientes, sin modificar el código.'
---

# pre-pr

Leer `AGENTS.md` y el [procedimiento compartido](../../../.claude/commands/pre-pr.md) completo antes de actuar. Las rutas del procedimiento se resuelven desde la raíz del checkout activo. Aplicar las reglas comunes de `AGENTS.md` y el alcance autorizado por el usuario.

Tomar la base opcional del pedido, por ejemplo `$pre-pr fase-3-ingles`. Ejecutar los checks desde la raíz del worktree elegido. Además del diff de commits, incluir los cambios locales y archivos nuevos en el barrido cuando estén dentro del alcance.

Si no hay tests e2e, informar falta de cobertura; no informar Playwright verde. No corregir archivos, crear commits, pushear ni abrir un PR como parte de este diagnóstico.
