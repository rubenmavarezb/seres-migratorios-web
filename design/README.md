# design/ — diseño aprobado (fuera del build)

Copia local de los dos proyectos de Claude Design, sincronizada el 06.09.2026 con `DesignSync`. No se importa desde `src/`, está en `.prettierignore` y en los `ignores` de ESLint. Es la referencia visual obligatoria para construir y revisar cada página y componente.

## Qué hay

- `*.dc.html`: las nueve páginas aprobadas de "Seres Migratorios - Web" (proyecto `63856107-1bcb-4f60-bb2d-aa48f42e24c7`) más `Prototipo.dc.html` (navegador de pantallas del canvas). Cada página cierra con un comentario `NOTA PARA DESARROLLO` obligatorio y con un `renderVals()` que trae los datos de la pantalla. `support.js` es el runtime del canvas.
- `_ds/…/`: el bundle del design system tal como lo consume la web (`tokens/*.css`, `styles.css`, `readme.md`, `_ds_manifest.json`, `_ds_bundle.js`).
- `ds/`: el proyecto "Seres Migratorios Design System" (`0c7dc7ac-4de3-43ea-b58b-9219245dfbcd`): `SKILL.md`, `components/**/*.jsx` (implementación de referencia de los 16 canónicos más `Aparejo`, en React; se traducen a Astro con tokens de Tailwind, nunca se copian) y `components/**/*.card.html` (previews), `thumbnail.html`, y `canvas/` (las nueve láminas locales de `02-Design-System/canvas/`).
- `assets/`: PNG con transparencia extraídos de los PSD de la edición 01 (obra, retratos, manuscritas, marca, logos) más `placeholder-retrato.svg`. `ds/assets` es un enlace a esta misma carpeta.

## Qué no se sincronizó

- Binarios que superan el tope de 192 KiB de `get_file` y no existen en la carpeta local: `assets/obra/ruben-mavarez-web-01.png` a `-08.png`, `assets/retratos/ruben-mavarez.png`, `assets/piezas/post-refugio.jpg`; del design system, `assets/fotos/*.png`, `assets/piezas/*.jpg`, `assets/logos/franja-aliados.png` y `assets/obra/gustavo-sanchez-01.png`. Hay que exportarlos a mano desde Claude Design.
- `uploads/` y `.bundles/` de la web (originales pesados) y, del design system, `*.d.ts`, `*.prompt.md`, `guidelines/*.html` y `ui_kits/**` (documentación redundante con `02-Design-System/design-system.md`).

## Cómo ver una página

Los `.dc.html` esperan `window.React` y `window.ReactDOM` (los inyecta el host de Claude Design). Para renderizarlos localmente: servir esta carpeta con un servidor estático y abrir la página con un envoltorio que cargue React 18 y ReactDOM UMD antes de `support.js`; las tarjetas `ds/components/**/*.card.html` ya lo hacen solas (necesitan red para unpkg). Si no se puede renderizar, la especificación son los estilos inline y las variables de `_ds/…/tokens/`.
