---
description: Da de alta un artista o una edición siguiendo el runbook de CLAUDE.md — rama contenido/<tipo>-<slug>, markdown con el frontmatter del modelo, carpetas de assets, alta en la edición y cambio de estado — y valida con astro check, test:unit y build
---

**Propósito**: ejecutar de punta a punta el procedimiento "Cómo agregar un artista o una edición" de `CLAUDE.md`, que hoy son seis pasos manuales fáciles de dejar a medias (el slug que no entra en `fotean`, la edición anterior que no baja a `pasada`, el `numero` puesto a quien solo expone). Es el compañero ejecutable de la skill `contenido-y-i18n`, que enseña las reglas que este comando aplica.

**Uso**:

```
/agregar-contenido <artista|edicion> <slug>
```

- `<tipo>`: `artista` o `edicion`.
- `<slug>`: kebab-case, `[a-z0-9-]+`, permanente (los slugs de contenido nunca cambian).

Ejemplo:

```
/agregar-contenido artista gustavo-sanchez
/agregar-contenido edicion buenos-aires-2027
```

## Qué hacés

1. **Validar la entrada**: parsear `$ARGUMENTS`. Si falta el tipo o el slug, o el slug no cumple `^[a-z0-9-]+$`, frenar y pedirlo. Si ya existe `src/content/<artistas|ediciones>/<slug>.md`, frenar: este comando no sobreescribe.

2. **Pre-flight de git** (obligatorio, `~/CLAUDE.md`): `git config user.email` contra `git remote get-url origin`, y detectar la rama por defecto con `git symbolic-ref refs/remotes/origin/HEAD`. Crear la rama `contenido/<tipo>-<slug>` desde la rama por defecto actualizada (`git fetch origin` primero). Si el árbol tiene cambios sin commitear, frenar.

3. **Reunir los datos, sin inventar ninguno**: leer el esquema de la colección en `src/content.config.ts` y preguntar a Ruben cada campo obligatorio que no esté en el pedido. Todo lo que no se sepa va como placeholder `[ENTRE CORCHETES]`. Para un artista: `nombre`, `roles` (obligatorio), `numero` solo si `roles` incluye `fotea`, `ciudad`, `pais`, `instagram`, `frase { es, en }`, `retratoAlt { es, en }`, ediciones en las que participa. Para una edición: `nombre`, `ciudad`, `pais`, `fecha`, `horario`, `lugar`, `estado`, `claim { es, en }`, `descripcion { es, en }`, `sello`, y las listas `fotean` / `exponen` / `musica` / `aliados`.

4. **Escribir el markdown** en `src/content/<colección>/<slug>.md` con el frontmatter completo del modelo, tomando como plantilla un archivo existente de la misma colección (por ejemplo `herick-frontado.md` o `buenos-aires-2026.md`). Capitalización real en todos los valores; los no traducibles idénticos en `es` y `en`; `[EN PENDIENTE]` donde no haya traducción. Cuerpo del markdown con la bio o descripción, o su placeholder.

5. **Preparar los assets**: crear las carpetas que correspondan y avisar qué archivo falta en cada una, sin crear imágenes. Artista: `src/assets/retratos/<slug>.(png|jpg)` (800 px), `src/assets/fotos/<slug>/NN.png` (≤ 2400 px lado largo), `src/assets/manuscritas/<slug>.png` y `src/assets/firmas/<slug>.png` (PNG transparente o SVG). Edición: `src/assets/fotos/ediciones/<slug>/`. Si el retrato u obra todavía no existen, dejar el campo fuera del frontmatter (son opcionales) y listarlo como pendiente; no referenciar un archivo que no está.

6. **Enlazar con la edición**:
   - Artista: agregar el slug a `fotean` (si `roles` incluye `fotea`) o a `exponen` (si incluye `expone`) de cada edición listada en `ediciones`, y `musica` si corresponde.
   - Edición con `estado: proxima`: buscar la `proxima` actual con `grep -l 'estado: proxima' src/content/ediciones/*.md` y bajarla a `pasada` en el mismo cambio. Hay una sola `proxima` a la vez.

7. **Validar**: `npx astro check`, `npm run test:unit`, `npx prettier --write src/content` y `npm run build`. Un error de zod indica un campo mal formado: corregirlo, no relajar el esquema.

8. **Commit y reporte**: `git add` solo de los archivos tocados y commit `contenido: alta de <tipo> <slug>` con el trailer de coautoría de la sesión. No pushear ni abrir PR: eso lo decide Ruben tras revisar. Reportar los archivos creados y modificados, la lista de placeholders que quedaron y los assets que faltan copiar.

## Reglas

- Nunca inventar un dato: fecha, dirección, handle, cifra o link que no venga de Ruben o del contenido existente va como placeholder.
- No tocar `content.config.ts`, `theme.css`, `CLAUDE.md` ni componentes: si el alta necesita un campo nuevo, frenar y proponerlo.
- No sobreescribir un markdown existente ni borrar assets.
- No pushear ni mergear; no cambiar de rama si hay trabajo sin commitear.
- Si ya hay dos ediciones `proxima` antes de empezar, frenar y avisar: es un estado inválido previo.
