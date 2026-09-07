---
description: Corre el checklist "Antes de abrir un PR" de CLAUDE.md — astro check, lint, test:unit, prettier --check, build y playwright — más un barrido por color fuera de token, texto sin traducir, imagen sin alt y placeholder olvidado, y reporta qué falta antes de pedir el Deploy Preview
---

**Propósito**: reproducir localmente el job `ci` de `.github/workflows/ci.yml` y los puntos 1 a 5 del checklist "Antes de abrir un PR" de `CLAUDE.md`, en el mismo orden, para que el PR llegue verde a Netlify y a la revisión de Ruben. El punto 5 (revisión manual) se automatiza como barrido de `grep` sobre el diff.

**Uso**:

```
/pre-pr [base]
```

- `[base]`: rama contra la que se diffea para el barrido. Por defecto, la rama por defecto del remoto detectada con `git symbolic-ref refs/remotes/origin/HEAD`.

Ejemplo:

```
/pre-pr
/pre-pr kiro/fase-2-home
```

## Qué hacés

1. **Estado del árbol**: `git status --short`. Si hay cambios sin commitear, avisar y seguir (los gates corren sobre el árbol de trabajo, como en local), pero recordar al final que el CI corre sobre el commit. Detectar la base con el comando de arriba; si falla, usar `[base]` o preguntar.

2. **Gates del CI, en orden y sin frenar en el primero** (para reportar todo junto):
   - `npx astro check`
   - `npm run lint`
   - `npm run test:unit` (paridad i18n + texto hardcodeado en `.astro` (`scripts/texto-hardcodeado.mjs`, SM-047) + `node --test`)
   - `npx prettier --check .`
   - `npm run build`
   - `npx playwright test` (levanta `npm run preview`; si `tests/e2e/` sigue solo con `.gitkeep`, informar "sin tests e2e todavía (SM-059)" y no contarlo como fallo)

3. **Barrido de revisión manual** sobre `git diff <base>...HEAD --name-only` filtrado a `src/`:
   - **Color fuera de token**: `grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsl\(|text-\[#|bg-\[#|border-\[#|(bg|text|border)-(blue|gray|red|green|slate|zinc|neutral)-[0-9]'` excluyendo `src/styles/theme.css`.
   - **Radio y sombra**: `grep -nE 'rounded-|shadow-'` excluyendo `rounded-full` en `Sello.astro` y `SelloHorario.astro`, y `shadow-foto` en `FotoPegada.astro` y `theme.css`.
   - **Fuente prohibida**: `grep -niE 'inter|roboto|arial|helvetica|serial a|font-family'` en `.astro` y `.css` fuera del `@theme`.
   - **Imagen cruda**: `grep -nE '<img\b'` en `.astro` (solo el favicon en `Base.astro` es aceptable) y `grep -nE 'alt=""'` para confirmar que cada decorativa lleva `aria-hidden`.
   - **Texto sin traducir**: en cada `.astro` del diff, buscar strings legibles dentro del markup que no pasen por `t()` ni vengan de props o colección (`grep -nE '>[[:space:]]*[A-ZÁÉÍÓÚÑ][^<{]{4,}<'` como primer filtro, revisar a mano los resultados). Para cada página nueva en `src/pages/`, confirmar que existe la gemela en `src/pages/en/` y la fila en `RUTAS` de `src/i18n/rutas.ts`.
   - **Placeholders**: `grep -nE '\[[A-ZÁÉÍÓÚÑ][^]]*\]'` en `src/content` y `src/i18n`. No son fallo: se listan como inventario para que Ruben sepa qué falta pedir. Sí es fallo un placeholder dentro de `astro.config.mjs` o `netlify.toml` (rompe el build).
   - **Dato inventado**: para fechas, direcciones, handles y links nuevos en el diff, verificar que existan ya en `src/content/**` o `.env.example`; lo que no, marcarlo para que Ruben confirme la fuente.
   - **JavaScript de cliente**: `grep -nE '<script'` en el diff; solo `internos/Lightbox.astro` y la validación del formulario de convocatoria son aceptables.

4. **Reporte**, con este formato:

```
## pre-pr — <rama> contra <base>

| Gate | Resultado |
|---|---|
| astro check | OK / N errores |
| lint | OK / N problemas |
| test:unit | OK / falla |
| prettier --check | OK / N archivos |
| build | OK / falla |
| playwright | OK / sin tests e2e (SM-059) / falla |

### Barrido manual
- Color fuera de token: ninguno / lista archivo:línea
- Radio o sombra fuera de excepción: …
- Imagen sin alt o `<img>` crudo: …
- Texto sin traducir o página sin gemela EN: …
- Datos a confirmar con Ruben: …
- JavaScript de cliente fuera de los dos permitidos: …

### Placeholders pendientes (inventario)
- archivo → `[PLACEHOLDER]`

### Veredicto
LISTO PARA PR / FALTA: <lista>
Siguiente paso: pushear la rama y pedir el Deploy Preview de Netlify; nada se mergea a main sin la aprobación de Ruben.
```

Para un hallazgo de diseño o de contenido que no sea evidente, sugerir `auditor-design-system` o `auditor-contenido-bilingue` en vez de resolverlo acá.

## Reglas

- Solo lectura sobre el código: este comando no corrige nada. Si Ruben pide arreglar, es otra tarea.
- `npx prettier --check`, nunca `--write`, para no ensuciar el árbol dentro del reporte.
- No pushear, no abrir PR, no mergear. La rama por defecto está protegida por un hook local; se empujan ramas de fase.
- Si `npm run build` falla por una variable `PUBLIC_*` vacía, señalar `.env.example` y el panel de Netlify; no hardcodear un valor.
