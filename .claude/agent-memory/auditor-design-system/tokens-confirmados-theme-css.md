---
name: tokens-confirmados-theme-css
description: Lista de tokens de src/styles/theme.css confirmados durante la auditoría de Fase 3, para no volver a verificar su existencia cada vez que aparecen en una clase Tailwind.
metadata:
  type: project
---

Confirmado en `src/styles/theme.css` (`@theme`), líneas ~23 y ~59-61:
- `--color-grafito: #6b6b6b` → clase `text-grafito` / `border-grafito` etc.
- `--text-etiqueta: 0.875rem` (+ `--text-etiqueta--letter-spacing`) → clase `text-etiqueta`
- `--text-metadatos: 0.8125rem` → clase `text-metadatos`

**Por qué**: `Artista.astro` (Fase 3, bloque de traducción de la frase) introduce `CLASE_TRADUCCION = 'font-mono text-metadatos text-grafito m-0'`; en Tailwind v4 un token ausente de `@theme` compila a nada silenciosamente, así que valía la pena confirmar antes de dar el hallazgo por descartado.

**Cómo aplicar**: si aparece una clase con un token nuevo o poco visto (`text-*`, `bg-*`, `border-*` con nombre no obvio), grepear `src/styles/theme.css` antes de asumir que existe o no existe. Si no está: es hallazgo Critical/High ("color o token nuevo que el @theme no tiene" — escalar a Ruben, nunca proponer un valor inline).
