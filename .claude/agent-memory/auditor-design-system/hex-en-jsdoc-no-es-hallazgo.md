---
name: hex-en-jsdoc-no-es-hallazgo
description: Un valor hex citado dentro de un comentario JSDoc para documentar qué token de @theme representa no es un hallazgo de "color fuera de token".
metadata:
  type: project
---

En este repo es convención documentar, en el JSDoc de una plantilla, el valor hex real de un token cuando se lo menciona por claridad (ej. `Apoyar.astro`: "(#E4EAF8 = the `bg-azul-tinta-agua` token)"; `Pie.astro`: "`border-top: 1px solid #D9D6CF`" citando la geometría leída de la lámina, o "`#FBFAF7` page" explicando una OBSERVACIÓN histórica).

**Por qué**: la regla "ningún color hardcodeado" del CLAUDE.md aplica al código (clases Tailwind, `style=`, CSS), no a la prosa de un comentario que referencia un token existente para que quien lea entienda a qué corresponde.

**Cómo aplicar**: antes de reportar un hex como hallazgo, confirmar que aparece en una línea de código real (`class=`, `style=`, CSS) y no dentro de `/** ... */` o `//`. Si está en un comentario citando un token de `@theme`, no reportar.
