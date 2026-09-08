# Trabajar con agentes

Este repositorio comparte las reglas de diseño, contenido, accesibilidad y validación en [AGENTS.md](../AGENTS.md). El sitio usa Astro 7, Tailwind 4 y TypeScript estricto; las diferencias respecto de los documentos escritos para Astro 5 están en [notas-astro-7.md](notas-astro-7.md).

## Estructura

| Archivo o carpeta                                         | Función                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `AGENTS.md`                                               | Reglas comunes y mapa de procedimientos. Editar acá las convenciones del proyecto. |
| `CLAUDE.md`                                               | Entrada de Claude Code, que importa `AGENTS.md`.                                   |
| `.claude/settings.json`                                   | Permisos exclusivos de Claude Code, conservados.                                   |
| `.claude/skills/`, `.claude/commands/`, `.claude/agents/` | Detalle de los procedimientos existentes, reutilizado por ambos agentes.           |
| `.agents/skills/`                                         | Cinco entradas de skills para Codex que leen esos procedimientos.                  |
| `.codex/agents/`                                          | Dos auditores de Codex configurados en TOML, con sandbox de solo lectura.          |

Las entradas de Codex contienen únicamente el alcance y las adaptaciones necesarias. Para cambiar un procedimiento, editar su fuente en `.claude/`; para cambiar una regla general, editar `AGENTS.md`. Las menciones históricas a las reglas de `CLAUDE.md` remiten a las reglas comunes que este importa.

## Elegir el checkout

Abrir como proyecto la carpeta que contiene `package.json`, `AGENTS.md` y `.git`. Si se trabaja con varios worktrees, cada uno contiene el sitio completo y tiene su propia rama. Confirmarlo con:

```bash
git status --short
git branch --show-current
git worktree list
```

La configuración viaja con el repositorio. Los worktrees de otras ramas recibirán los archivos cuando se integre el cambio por el flujo habitual de Git. No hace falta mantener copias manuales de las reglas en cada rama.

La carpeta contenedora de worktrees puede tener un `AGENTS.md` local para orientar las sesiones abiertas allí; ese archivo está fuera de Git y no viaja con un clon. Las instrucciones y configuraciones versionables de este checkout son autosuficientes.

## Codex

Abrir este checkout en la app o ejecutar `codex` desde su raíz. Codex descubre `AGENTS.md` y las skills de `.agents/skills/`. En la CLI se pueden mencionar con `$`; también pueden seleccionarse cuando la descripción coincide con el trabajo. Ver la documentación oficial de [instrucciones](https://learn.chatgpt.com/docs/agent-configuration/agents-md) y [skills](https://learn.chatgpt.com/docs/build-skills).

Ejemplos de pedidos:

```text
$componente-astro-canonico revisá las props de FotoPegada
$contenido-y-i18n agregá esta traducción a los dos diccionarios
$paginas-bilingues agregá la contraparte inglesa de esta página
$pre-pr
$pre-pr fase-3-ingles
$agregar-contenido artista nombre-apellido
```

`nombre-apellido` es un ejemplo de slug, no una persona real ni una instrucción para crear contenido. El alta requiere los datos del pedido o placeholders válidos según el esquema.

Los auditores pueden pedirse por nombre:

```text
Usá el subagente auditor-design-system para revisar los cambios de esta rama.
Usá el subagente auditor-contenido-bilingue para revisar el contenido modificado.
```

Se definen en `.codex/agents/*.toml` con `name`, `description` y `developer_instructions`, siguiendo el formato de [agentes personalizados](https://learn.chatgpt.com/docs/agent-configuration/subagents). Heredan el modelo y el esfuerzo de la sesión; ambos fijan `sandbox_mode = "read-only"`. Sus instrucciones cargan los auditores originales, ajustan la base de comparación y tratan las memorias como opcionales.

Si el cliente no admite ese formato o no ofrece subagentes, pedir la revisión en la sesión principal usando el procedimiento Markdown correspondiente. No hace falta un plugin para aplicar esas reglas.

Después de agregar o modificar instrucciones, iniciar una sesión nueva para comprobar su carga. Un pedido útil es: «Decime qué instrucciones del proyecto cargaste y qué skills locales encontraste». Si no aparecen, comprobar que se abrió este checkout y que el proyecto es de confianza para Codex; las capas locales `.codex/` dependen de esa confianza. Ver [configuración de Codex](https://learn.chatgpt.com/docs/config-file/config-basic).

## Claude Code y otros agentes

Claude mantiene sus comandos `/pre-pr` y `/agregar-contenido`, sus tres skills y sus dos auditores. `CLAUDE.md` importa las reglas compartidas mediante `@AGENTS.md`.

Para un agente que no descubra `AGENTS.md` automáticamente, indicarle al iniciar: «Leé `AGENTS.md` completo y el procedimiento correspondiente a la tarea antes de editar». Todos los procedimientos son archivos de texto dentro del repo y se pueden seguir sin herramientas exclusivas de Claude.

Las referencias a `~/CLAUDE.md`, documentos externos o agentes de plugins en procedimientos antiguos no son requisitos de instalación. Usar las fuentes locales indicadas en `AGENTS.md`, el contexto entregado y las capacidades disponibles. Las memorias históricas no reemplazan las reglas ni el código actual.

## Permisos y validación

`.claude/settings.json` no configura Codex. Sus listas `allow`, `ask` y `deny` no se traducen automáticamente: las restricciones expresadas en `AGENTS.md` son instrucciones de trabajo, no un bloqueo del sistema de archivos.

La sesión principal conserva los permisos, modelo y conexiones de la configuración personal de Codex. No se agrega un `.codex/config.toml` general porque no hay ajustes comunes adicionales que imponer. Los TOML de los auditores sí limitan su sandbox a lectura. Tampoco se copian credenciales, memorias personales ni rutas absolutas de esta máquina.

Para cambios de aplicación, el checklist completo está en `AGENTS.md` y `$pre-pr`. Actualmente `tests/e2e/` solo contiene `.gitkeep`: eso significa ausencia de cobertura, no una prueba pasada. Para cambios exclusivos de estas instrucciones, validar Markdown, enlaces locales, frontmatter de skills y sintaxis TOML; no se necesita instalar dependencias nuevas ni modificar el sitio.
