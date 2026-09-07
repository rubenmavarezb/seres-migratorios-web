---
name: 'contenido-y-i18n'
description: 'Reglas de contenido y de la capa i18n de Seres Migratorios: campos { es, en } en las colecciones, placeholders entre corchetes en vez de datos inventados, lista de no traducibles, claves nuevas en es.json y en.json a la vez, tabla RUTAS en rutas.ts y el script de paridad. Cargar al editar src/content/**, src/i18n/** o src/content.config.ts.'
globs: 'src/content/**/*.md, src/i18n/*.json, src/i18n/*.ts, src/content.config.ts'
---

# contenido-y-i18n

## Resumen

Qué puede y qué no puede escribirse en el contenido y en los diccionarios del sitio. Dos reglas de oro de `CLAUDE.md`: **no inventar datos** y **bilingüe siempre**. El `auditor-contenido-bilingue` audita exactamente esto.

## Conceptos clave

- **`bilingue`**: helper de zod en `content.config.ts`, `{ es: string, en: string }` con ambos no vacíos. Todo texto de cara al público en una colección lo usa.
- **Placeholder**: valor `[ENTRE CORCHETES]` que el helper `oPlaceholder` acepta como contenido válido. Es la forma correcta de un dato que aún no existe. El dominio `seresmigratorios.com` no es placeholder.
- **No traducibles**: nombres propios, CONSULADO, handles, "Seres Migratorios", FAMILIA / RESILIENCIA / EXILIO, "¡Aguante la fotografía!" y las frases manuscritas. Se repiten iguales en `es` y `en`.
- **`t(idioma, clave)`**: única lectura de los diccionarios. `ClaveDeTexto` se deriva de `es.json`, así que una clave que falta en `en.json` compila y cae al español en silencio. `scripts/i18n-paridad.mjs` es el test que lo atrapa.
- **`RUTAS`**: tabla de `src/i18n/rutas.ts` con `clave`, `es` y `en` de las diez rutas públicas. `rutaLocalizada()` y el `hreflang` salen de ahí.

## Patrones a seguir

### Todo campo público es `{ es, en }`

```yaml
# ✅ CORRECTO — ambos idiomas, traducción provisoria marcada
frase:
  es: >-
    El suspiro involuntario al verme rodeado de mi gente.
  en: >-
    [revisar traducción] The involuntary sigh of finding myself surrounded by my people.
```

### Lo que falta va como placeholder visible

```yaml
# ✅ CORRECTO — no hay bio ni descripción todavía
alt:
  es: '[DESCRIPCIÓN DE LA IMAGEN 01]'
  en: '[IMAGE 01 DESCRIPTION]'
instagram: '[INSTAGRAM PENDIENTE]'
```

### Clave nueva en los dos JSON en el mismo commit

```jsonc
// es.json
{ "apoyar": { "titulo": "Toooda ayuda es bienvenida" } }
// en.json
{ "apoyar": { "titulo": "[EN PENDIENTE]" } }
```

Después: `npm run test:i18n` tiene que decir `OK`.

### Ruta nueva: fila en `RUTAS` y gemela EN

```ts
// src/i18n/rutas.ts
{ clave: 'apoyar', es: '/apoyar', en: '/en/support' },
```

Y `ClaveDeRuta` suma el literal. `tests/unitarias/rutas.test.mjs` debe seguir verde (`npm run test:unit`).

### Datos de colección con su capitalización real

```yaml
# ✅ CORRECTO — el componente aplica uppercase
sello:
  ciudad: Buenos Aires
  fechaCorta: 08 ago 2026
```

### Reglas de altas

- **Artista**: `roles` obligatorio; `numero` (`'001'`–`'007'`) solo para quien fotea; retrato, obra, frase y firma en sus carpetas de `src/assets/`; slug agregado a `fotean` o `exponen` de la edición.
- **Edición**: una sola con `estado: proxima`; al dar de alta la próxima, la anterior baja a `pasada` en el mismo PR. `fecha` real o placeholder, nunca estimada.
- **Convocatoria**: si `abierta` es `false` en ambos idiomas, el `<form>` no se renderiza y puede desaparecer del panel de Netlify Forms.

## Anti-patrones

### Inventar un dato para que "quede lindo"

```yaml
# ❌ MAL — nadie confirmó esta fecha ni esta dirección
fecha: 2027-03-15
lugar:
  direccion: Av. Corrientes 1234
```

**Fix**: `fecha: '[FECHA PRÓXIMA EDICIÓN]'` y `direccion: '[DIRECCIÓN PENDIENTE]'`. Un dato inventado es un error grave; un placeholder es correcto.

### Español silencioso en `en`

```yaml
# ❌ MAL — el lector inglés ve español sin aviso
descripcion:
  es: Un recorrido fotográfico.
  en: Un recorrido fotográfico.
```

**Fix**: `en: '[EN PENDIENTE]'` o la traducción real.

### Traducir un no traducible

```json
// ❌ MAL
{ "pie": { "aguante": "Long live photography!" } }
```

**Fix**: `"¡Aguante la fotografía!"` en ambos JSON.

### Texto visible en un `.astro`

```astro
<!-- ❌ MAL -->
<p>Sumate a la próxima edición</p>
```

**Fix**: `{t(idioma, 'convocatoria.llamado')}` con la clave en ambos JSON.

### Arrays en los diccionarios

`ClavesDe<T>` es recursivo sobre objetos y strings; un array rompe el tipo y `i18n-paridad.mjs` lo reporta como forma inválida. Usar claves numeradas (`requisito1`, `requisito2`) o mover la lista a una colección.

## Ejemplos

### Ejemplo 1 — alta de artista que solo expone

**Contexto**: `src/content/artistas/gabriela-rondon.md`.

**Antes**: `numero: '008'`, `roles: [expone]`.

**Después**: sin `numero` (solo quien fotea lo tiene), `roles: [expone]`, slug en `exponen` de `buenos-aires-2026.md`.

**Por qué**: `numero` identifica el set del recorrido; quien expone no tiene set.

### Ejemplo 2 — clave nueva sin traducción

**Contexto**: nueva sección "Cómo apoyar" en el home.

**Antes**: solo `es.json` recibe `home.apoyar.titulo`.

**Después**: `en.json` recibe la misma clave con `"[EN PENDIENTE]"`; `npm run test:i18n` pasa.

**Por qué**: sin la clave en `en.json`, `t()` cae al español sin avisar y el CI falla en `test:unit`.

## Referencias

- `CLAUDE.md` raíz, "Reglas de contenido", "Formulario de convocatoria", "Cómo agregar un artista o una edición".
- `src/content.config.ts`, `src/i18n/utils.ts`, `src/i18n/rutas.ts`, `scripts/i18n-paridad.mjs`.
- Comando compañero: `/agregar-contenido` ejecuta el alta paso a paso.
- Skill relacionada: `.claude/skills/paginas-bilingues/SKILL.md` para la página que consume la ruta.

---

## Cuándo invocar esta skill

Al editar cualquier markdown de `src/content/`, los JSON o TS de `src/i18n/`, o `src/content.config.ts`; y siempre que un cambio agregue texto visible nuevo en cualquier `.astro`, porque ese texto termina en los diccionarios.
