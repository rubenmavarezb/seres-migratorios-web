---
name: agregar-contenido
description: 'Dar de alta un artista o una edición en Seres Migratorios con sus campos bilingües, referencias y placeholders, sin inventar datos.'
---

# agregar-contenido

Leer `AGENTS.md` y el [procedimiento compartido](../../../.claude/commands/agregar-contenido.md) completo antes de actuar. Las rutas del procedimiento se resuelven desde la raíz del checkout activo. Aplicar las reglas comunes de `AGENTS.md` y el alcance autorizado por el usuario.

Tomar el tipo y slug del pedido, por ejemplo `$agregar-contenido artista nombre-apellido`. `$ARGUMENTS` en el procedimiento significa esos argumentos del usuario; no es una variable de shell.

Usar `AGENTS.md` y la configuración Git del checkout como contexto; `~/CLAUDE.md` no es un requisito portable. Respetar el worktree y la rama asignados; no cambiar de rama con cambios locales. Conservar el alta en una rama `contenido/<tipo>-<slug>` cuando corresponda crearla según la tarea.

El paso de commit del procedimiento solo aplica si ya está autorizado en la sesión. En caso contrario, dejar el diff listo para revisión y reportar placeholders y assets pendientes. La falta de datos que admiten placeholders no obliga a detener toda el alta. Formatear únicamente los archivos tocados.
