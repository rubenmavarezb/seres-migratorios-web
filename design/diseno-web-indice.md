# Diseño web v1 — índice y traspaso a desarrollo

Estado: **diseño aprobado el 06.09.2026** (nueve páginas, 27 pantallas). Fuente: proyecto "Seres Migratorios - Web" en Claude Design, https://claude.ai/design/p/63856107-1bcb-4f60-bb2d-aa48f42e24c7. Este documento resume lo que un desarrollador necesita saber antes de construir el sitio con `PLAN.md`, `sitemap.md`, `modelo-de-contenido.md` y `backlog.md`; lo que no está acá se lee en la "NOTA PARA DESARROLLO" al final de cada archivo `.dc.html`.

_Nota del 06.09.2026, posterior a la aprobación del diseño: el hosting pasó a Netlify, el formulario a Netlify Forms y el analytics a Cloudflare Web Analytics (ver `PLAN.md` §12.1), y se aprobó el movimiento del sitio (`design-system.md` §11). El diseño no cambia: el formulario ya estaba pensado como HTML nativo con envío a `/gracias`, que es exactamente lo que Netlify Forms necesita, y el movimiento se apaga con `prefers-reduced-motion`, con lo que el sitio queda idéntico a las pantallas aprobadas._

## Archivos, rutas y pantallas

| Archivo | Ruta | Pantallas (`data-screen-label`) |
|---|---|---|
| `Home.dc.html` | `/` | Home · Desktop · Home · Mobile · Home · Mobile · Menú abierto |
| `Manifiesto.dc.html` | `/manifiesto` | Manifiesto · Desktop · Manifiesto · Mobile |
| `Artistas.dc.html` | `/artistas` | Artistas · Desktop · Artistas · Mobile · Fila · estados |
| `Artista.dc.html` | `/artistas/[slug]` | Herick y Rubén en desktop y mobile · Sin obra · Desktop · Sin obra · Mobile · Lightbox |
| `Ediciones.dc.html` | `/ediciones` | Ediciones · Desktop · Ediciones · Mobile · Próxima edición · Con fecha |
| `Edicion.dc.html` | `/ediciones/[slug]` | Edición 01 · Desktop · Edición 01 · Mobile |
| `Convocatoria.dc.html` | `/convocatoria` y `/gracias` | Convocatoria · Desktop · Mobile · Formulario · error · Gracias · Desktop · Gracias · Mobile · Convocatoria cerrada · Desktop |
| `Apoyar.dc.html` | `/apoyar` | Apoyar · Desktop · Apoyar · Mobile |
| `NoEncontrada.dc.html` | 404 | 404 · Desktop · 404 · Mobile |

El índice completo (con placeholders por archivo) está en el comentario "ÍNDICE DEL SITIO" al final de `Home.dc.html`. Todo está en español; la variante `/en/` no se diseñó: se construye con las mismas pantallas y los textos de `en.json`.

## Constantes de layout que salen del diseño

Contenedor de 1280 px con padding lateral de 48 px en desktop y 24 px en mobile. Secciones separadas por `border-top: 1px solid linea`, con padding vertical de 64 px (48 en mobile). Títulos de sección en display 3.5rem (2rem en mobile); titulares de página en 7.5rem (3rem en mobile); el TitularPartido de la Home en 14rem y el de la edición en 11rem. Bloques de "título + contenido" en grilla 4fr/8fr. Nav de 80 px (68 en mobile). Pie con FranjaAliados a 36 px de alto (28 en mobile), HiloTricolor, sello compacto de 120 px (100 en mobile), Email e Instagram en mono y "¡Aguante la fotografía!" manuscrito. Botones de 44 px de alto, a ancho de contenido en desktop y completo en mobile. FotoPegada con rotaciones entre -2° y 2°. Los links mono en mayúsculas llevan padding vertical de 12 px para llegar a los 44 px.

## Decisiones tomadas durante el diseño que afectan al desarrollo

1. **Sección "Artistas"** en lugar de "Fotógrafos": ruta `/artistas` (`/en/artists`, con 301 desde `/fotografos`), colección `artistas` con `roles[]` y un solo perfil por persona. Reflejado en `PLAN.md`, el BRIEF (v1.3), `modelo-de-contenido.md` y `sitemap.md`.
2. **`Pie.astro` compone el pie**: el diseño no usa un componente Pie del design system sino FranjaAliados + HiloTricolor + Sello + Anotacion. El Pie es único en todo el sitio y no tiene variantes (mantiene la FranjaAliados aunque la página tenga una sección "Aliados").
3. **`Aparejo`** (los nombres de quienes exponen en filas 3/3/3 desktop y 2/1 mobile, cada CajaNombre enlazando al perfil) no es canónico: va en `components/internos/Aparejo.astro` como helper de CajaNombre.
4. **Retrato**: una obra nunca hace de retrato. Quien no entregó retrato muestra la caja punteada `[RETRATO]` (`placeholder-retrato.svg`); hoy es el caso de Naia Guanipa.
5. **Perfil "Sin obra"** (desktop y mobile) es el estado por defecto hasta que cada persona entregue fotos: la ficha muestra número, nombre, rol, handle y `[OBRA]`, `[BIO CORTA]`, frase y firma `[PENDIENTES]`.
6. **Lightbox** en `/artistas/[slug]`: `<dialog>` sobre papel, foto centrada con borde blanco, "CERRAR" arriba a la derecha, "←" y "→" en mono, caption "001 Herick Frontado · [TÍTULO DE LA FOTO]".
7. **Convocatoria**: el `estado` de la colección `convocatorias` controla la página. Abierta: h1 "CONVOCATORIA ABIERTA" con la anotación "sumate", h2 "POSTULATE" y el formulario. Cerrada: h1 "CONVOCATORIA", h2 "LA PRÓXIMA", CajaNombre en grafito "CONVOCATORIA CERRADA", la línea "La próxima se anuncia por acá." y el Boton sello a Instagram. Los tres bloques (QUÉ BUSCAMOS, CÓMO FUNCIONA, QUIÉN PUEDE POSTULARSE) no cambian.
8. **Formulario**: NOMBRE, CIUDAD, PAÍS, EMAIL, INSTAGRAM (placeholder "@usuario"), PORTFOLIO (URL), DISCIPLINA (select: fotografía / film / música / otro, placeholder "Elegí una"), EDICIÓN A LA QUE TE POSTULÁS, MENSAJE CORTO (textarea de 4 filas), checkbox de consentimiento. Requeridos: nombre, ciudad, país, email, disciplina y consentimiento; Instagram debe empezar con arroba; portfolio es URL opcional. Errores: borde inferior y etiqueta en `error` #B3261E, mensaje mono debajo del campo ("Falta el email.", "El usuario va con arroba: @usuario.") y resumen con `role="alert"` arriba del botón: "Revisá los campos marcados". Envío exitoso → `/gracias` (ruta propia, con Nav y Pie; en inglés `/en/thanks`). **En el código** el `<form>` suma `name="convocatoria"`, `data-netlify="true"`, `data-netlify-honeypot="bot-field"`, `action="/gracias"` y un campo oculto `idioma`; el mismo `name` se usa en ES y en EN (ver `PLAN.md` §8). **Los mensajes de error del diseño necesitan JavaScript**: la validación nativa muestra burbujas del navegador, no estos mensajes. Decisión: mejora progresiva con un `<script>` mínimo que pone `novalidate`, valida con la Constraint Validation API y escribe los mensajes con `aria-describedby` y `aria-invalid`; sin JavaScript queda la validación nativa estilada con `:user-invalid` (`PLAN.md` §8).
9. **Ediciones**: dos estados del bloque "Próxima edición": sin fecha (BloqueFicha con placeholders, "Todavía no hay fecha para la próxima edición." y Boton sello "SEGUINOS EN INSTAGRAM") y con fecha (anotación "edición 02" y Boton "POSTULATE"). Lo decide la edición con `estado: proxima`.
10. **Edición 01**: sin SelloHorario (los horarios van en el BloqueFicha) y sin cifras de recaudación. La galería "La jornada" es un collage en grilla de 12 columnas con solapes; las fotos sin autoría confirmada (`pusadolfo-01`, `sin-atribuir-*`) llevan "[AUTORÍA A CONFIRMAR]" y nunca van en un perfil.
11. **Apoyar**: en v1 no hay colección de copias en venta; la sección muestra una FotoPegada de muestra con "[TÍTULO] · [PRECIO]" y el link `[LINK COPIAS EN VENTA]`. Si más adelante se listan copias, se agrega una colección `copias` al modelo.
12. **404**: página con Nav y Pie, sello grande rotado -12°, "PÁGINA NO ENCONTRADA", anotación "acá no hay nada" (decorativa: el mensaje accesible es la línea mono) y Boton "VOLVER AL INICIO".
13. **Posicionamiento**: en el diseño toda colocación (grid, márgenes, rotación del contenedor) vive en un div envolvente y no en el componente. En Astro se traduce igual: los componentes canónicos no aceptan clases de posición, se envuelven.

## Movimiento (aprobado el 06.09.2026, `design-system.md` §11)

Las pantallas del diseño son estáticas a propósito: el movimiento se define en el design system, no en los `.dc.html`, y con `prefers-reduced-motion` el sitio queda exactamente como se aprobó. Lo que hay que construir, todo en CSS y ya escrito en `tokens.css` / `tailwind-theme.css`:

- Entradas por scroll con `animation-timeline: view()` sobre el atributo `data-entrada`: `FotoPegada` y `FichaFotografo` se apoyan (opacidad + `translate` 12 px), `Sello` estampa (`data-entrada="sello"`: opacidad + `scale` 1.06 → 1), cada fila del `Aparejo` entra como unidad, y el `HiloTricolor` del `Pie` hace un barrido con `clip-path` (`data-entrada="hilo"`; sujeto a prueba en dispositivo, si se lee como barra de carga se quita). Doble envoltorio obligatorio: `@media (prefers-reduced-motion: no-preference)` y `@supports ((animation-timeline: view()) and (animation-range: entry))`; nada arranca oculto fuera de ahí.
- Nunca animar `transform` (lo usan las rotaciones estáticas de `FotoPegada`, `Anotacion` y `Sello`): solo `opacity`, `translate`, `scale` y `clip-path`. `animation-duration: auto` en las de scroll.
- No se animan `TitularPartido`, `BloqueFicha`, texto letra por letra ni las rotaciones. Nada de parallax, bounce ni loops.
- Cambio de página con View Transitions cross-document (`@view-transition { navigation: auto }` en el CSS global y `view-transition-name: titular` en el `TitularPartido`), **sin `<ClientRouter />`**: cero JavaScript de navegación y el POST de Netlify Forms nunca queda interceptado. Si algún día se adopta `<ClientRouter />`, el `<form>` lleva `data-astro-reload`.
- Menú mobile y lightbox: `<dialog>` con `@starting-style` y `transition-behavior: allow-discrete`, `--duracion-media`. Hover y foco: `--duracion-rapida`.
- Tokens nuevos: `--duracion-entrada` 350ms y `--desfase-entrada` 40ms (solo para la entrada por carga del hero: `Sello` y claim).

## Placeholders pendientes en todo el sitio

`[EMAIL DEL COLECTIVO]` (pie, nueve páginas) · `[FECHA PRÓXIMA EDICIÓN]`, `[HORARIOS]`, `[LUGAR]` (Home, Ediciones) · `[PRÓXIMA EDICIÓN A CONFIRMAR]` (Convocatoria) · `[LINK MERCADO PAGO]` (Home, Apoyar) · `[LINK PAYPAL]`, `[LINK CAFECITO]`, `[LINK COPIAS EN VENTA]`, `[TÍTULO] · [PRECIO]`, `[TEXTO DE TRANSPARENCIA]`, `[MONTO Y DESTINO A CONFIRMAR]` (Apoyar) · `[AUTORÍA A CONFIRMAR]` (Edición 01, tres fotos) · `[RETRATO]` de Naia Guanipa (Home, Artistas, Artista, Edición) · handles a confirmar de Pati Caro (@huella.solar) y Leo Simmons (@xlsimio); Gabriela Rondón y Gustavo Sánchez con `[HANDLE]` · aliados a confirmar: logo tricolor de manos y CCC (FranjaAliados) · `[BIO CORTA]`, `[TÍTULO DE LA FOTO]`, `[OBRA]`, frases y firmas `[PENDIENTES]` (perfiles).

**Resuelto el 06.09.2026:** el dominio. Era `[DOMINIO]` y ahora es **`seresmigratorios.com`** (Namecheap, apuntando al proyecto `seres-migratorios` de Netlify). Afecta al `site` de `astro.config.mjs`, a los canonical, a los `hreflang`, al sitemap y a las URLs de las OG.

**Resuelto el 06.09.2026:** el endpoint del formulario deja de ser un placeholder. Netlify Forms identifica el formulario por su `name` en el HTML, así que no hay URL que cargar ni variable de entorno que definir. Los prompts 3, 4 y 5 de Claude Design (docs 15, 16 y 17) lo siguen listando como pendiente porque son el registro de lo que se pidió en su momento: no se corrigen.

## Copy a confirmar con el colectivo

No son datos inventados pero sí afirmaciones que el diseño asumió y conviene validar antes de publicar: "Lo recaudado va a la causa" (Copias en venta, en Home y Apoyar), "Escribinos por Instagram" (Voluntariado), "Te escribimos por email cuando cierre la convocatoria." (`/gracias`) y las tres líneas de QUÉ BUSCAMOS / CÓMO FUNCIONA / QUIÉN PUEDE POSTULARSE en Convocatoria.

La línea de `/gracias` merece atención extra con el cambio a Netlify Forms: es una promesa de que alguien del colectivo va a escribir, no un email automático. Netlify notifica al colectivo cada envío, pero la respuesta a quien se postula la manda una persona, salvo que se implemente la opción (b) de `PLAN.md` §8.

## Cómo bajar los archivos

Desde una sesión de Claude Code con el skill `/design-sync`, sincronizar el proyecto `63856107-1bcb-4f60-bb2d-aa48f42e24c7` a una carpeta local (`design/` en el repo, fuera del build) para tener los `.dc.html`, `assets/` y el bundle del design system al lado del código. Los assets de `assets/` son los mismos de `02-Design-System/assets-fuente/_para-claude-design/`.
