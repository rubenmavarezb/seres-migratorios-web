# Fase 4 — Convocatoria y apoyo

Base: `origin/main` (`0f0555a`). Rama: `fase-4-convocatoria`.
Revisión: 08.09.2026. Convocatoria 02 cerrada en la entrega final.

## Implementación

- SM-054: plantillas compartidas Convocatoria y Gracias, con envoltorios ES/EN.
  Diez campos con Campo, `name="convocatoria"` en ES y `name="open-call"` en EN, idioma oculto y POST a
  `/gracias` o `/en/thanks`. Gracias tiene `noindex` y sigue excluida del sitemap.
- SM-055: honeypot `bot-field` con `hidden` y `tabindex="-1"`; campos obligatorios,
  email, URL y patrón de Instagram con validación nativa sin JavaScript.
- SM-070: mejora progresiva con Constraint Validation API; mensajes desde `t()`,
  `aria-invalid`, `aria-describedby`, resumen `role="alert"` y foco en el primer
  campo inválido. Un envío válido conserva el POST nativo.
- SM-056: cerrada no emite ningún formulario; conserva información, caja grafito
  e Instagram. Home, Ediciones y Apoyar consultan `convocatorias.abierta` para
  mostrar «Cómo participar»; abierta conserva el botón anterior.
- No se agregaron dependencias ni se completaron datos editoriales por inferencia.

## Verificación local

- Astro check: 0 errores y 0 warnings; 4 hints heredados del material de diseño.
- ESLint y Prettier: limpios. Build: 47 páginas.
- Unitarias: 106 pruebas, todas pasan, con Node 22.22.0. Paridad: 213 claves.
- Regresión del gate: permite el identificador técnico `Campo.nombre`, pero
  sigue rechazando etiquetas de Campo y nombres visibles de otros componentes.
- `scripts/verificar-convocatoria.mjs`: abierto ES/EN con y sin JavaScript;
  vacío, email, Instagram, portfolio, consentimiento, recuperación de errores,
  POST simulado y destino localizado. Cerrado y `noindex` también comprobados.
  El script intercepta todos los POST; no envía datos a Netlify.
- Axe WCAG 2.0/2.1 A+AA: 0 violaciones en las cuatro rutas × 1440/390, y en
  convocatoria abierta ES/EN × 1440/390. Los estados de error ES/EN también dan 0.
- Capturas en [capturas/fase-4](capturas/fase-4), revisión visual escritorio/móvil.
  Recorrido de Tab: diez campos y botón, sin honeypot. Reduced motion anula las
  cuatro rotaciones de convocatoria. Sin desborde del viewport a 390/768/820/1024/1440.
- Auditores de contenido bilingüe y design system: 0 hallazgos nuevos confirmados.
  Leído el HTML EN completo de convocatoria abierta/cerrada y agradecimiento.
- Comparación de 20 páginas ES con build de `0f0555a`: idénticas al normalizar
  exclusivamente el nombre del CSS generado. No son idénticas byte a byte:
  Tailwind cambia el hash global al agregar utilidades. El JSON de evidencia
  registra ambas comparaciones. Apoyar queda fuera porque cambia su CTA.
- `tests/e2e/` todavía no tiene cobertura (SM-059, Fase 5); no se informa como verde.

Reproducir con Node 22.22.0 y dependencias locales:

```bash
npm run check
npm run lint
npm run test:unit
npx prettier --check .
npm run build
node scripts/capturas-axe.mjs /convocatoria/ /en/open-call/ /gracias/ /en/thanks/ --prefijo SM-054 --salida docs/capturas/fase-4
npx astro preview --port 4404
node scripts/verificar-convocatoria.mjs http://localhost:4404
```

Para probar abierto: cambiar temporalmente `abierta: true`, reconstruir y ejecutar
el último script con `--abierta`. Restituir `false` y reconstruir al terminar.

## Netlify — SM-053

La API autenticada permite revisar proyecto, formularios y notificaciones sin
leer credenciales ni `.netlify/`. La sesión del navegador integrado pide login.
Antes del primer deploy: lista de formularios vacía y ninguna notificación.

El equipo usa **Free heredado** (`free-is-free`, `credit_features: false`):
la API informa **100 envíos por período mensual** y 10 MB de archivos. El sitio
no acepta archivos. Período consultado: septiembre de 2026. Comprobar el contador
en Forms → Usage and configuration antes de abrir la convocatoria.

La documentación actual diferencia ese plan de los planes por créditos, donde
Forms es gratuito y sin límite. No se cambió el plan ni su configuración.

- [Configuración de formularios](https://docs.netlify.com/manage/forms/setup/):
  Netlify inserta `form-name` al procesar HTML estático. Se incluye explícitamente
  también en origen para que el contrato POST sea inspeccionable en local.
  No hace falta formulario espejo en este sitio estático.
- [Filtros antispam](https://docs.netlify.com/manage/forms/spam-filters/): el
  honeypot relleno se rechaza silenciosamente; la respuesta HTTP sola no prueba
  su descarte, hay que contrastar las entradas recibidas.
- [Uso y facturación](https://docs.netlify.com/manage/forms/usage-and-billing/)
  y [planes heredados](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/billing-faq-for-legacy-plans/).

El envío real, la persistencia de los formularios tras cerrar y la notificación se
documentan en el comentario del Deploy Preview y al final de este informe. Rubén
confirmó `seresmigratorios@gmail.com` como destinatario; la notificación está configurada.

## DoD y pendientes

- [x] Errores accesibles con JavaScript y validación nativa sin él.
- [x] Ambas páginas de gracias y ambos estados de convocatoria.
- [x] Apoyar mantiene los placeholders.
- [x] Dos formularios registrados en Netlify; cinco pruebas recibidas en spam.
- [ ] Envío aceptado como postulación verificada (0 entradas verificadas).
- [x] Honeypot descartado: ausente tanto de verificadas como de spam.
- [x] Ambos formularios conservados tras el cierre final, con los mismos IDs y honeypot.
- [x] Confirmación ES/EN después del POST real, incluso sin JavaScript.
- [x] Notificación al colectivo configurada a `seresmigratorios@gmail.com`.
- [ ] Recepción de la notificación en el buzón del colectivo.
- [ ] Deploy Preview aprobado por Rubén; merge a cargo de Rubén.

SM-057/058 siguen a cargo de Rubén: texto y fechas reales, requisitos, links de
donación y transparencia. Fase 5 comienza después del cierre de esta DoD y el
merge de Fase 4; SM-059 será su primera tarea. Quedan para esa fase OG exportadas,
token de Cloudflare, revisión humana de traducciones, autorizaciones y aliados.

## OBSERVACIONES

1. `design/Convocatoria.dc.html` sí contiene Gracias en desktop y mobile, aunque
   la consigna dice que no hay lámina. Se aplicó el diseño aprobado, consistente
   con SM-054: un botón y `gracias.linea`; sitemap §2.9 promete otra confirmación
   por email y un segundo botón, y queda pendiente de actualización por Rubén.
2. `paginas-bilingues` describe duplicación EN y lectura implícita del idioma.
   Se siguió la arquitectura real de Fase 3, con plantilla compartida e idioma explícito.
3. La lámina prevalece sobre sitemap §2.7: sin badge adicional de fechas, pasos
   numerados ni sello y enlace extra al pie del formulario. La anotación conserva
   el límite canónico −3°, documentado en el componente.
4. A 768 px la caja «Quién puede postularse» medía 249 px en una columna de 203 px.
   Las tres columnas se activan desde `lg`; no cambia la composición aprobada a
   1440/390 ni el componente canónico.
5. Node 22.12.0 no ejecuta directamente las unitarias heredadas que importan TS.
   Con Node 22.22.0 instalado pasan sin flags; CI usa la rama 22 de `.nvmrc`.
6. El HTML ES no puede ser idéntico byte a byte al agregar CSS global: cambia el
   hash del recurso. La normalización se limita a ese hash y queda declarada.
7. PLAN §8 pide anotar el límite en la fuente externa, pero esas fuentes son de
   solo lectura. El valor verificado queda aquí; Rubén puede trasladarlo al PLAN.

Fuentes externas consultadas sin modificar: PLAN, backlog, sitemap, modelo de
contenido y BRIEF técnico en `Documents/Seres Migratorios`.

## Primera prueba del Deploy Preview #16 — antes de separar nombres

[PR #16](https://github.com/rubenmavarezb/seres-migratorios-web/pull/16) y
[preview](https://deploy-preview-16--seres-migratorios.netlify.app).

- Apertura temporal: `84ba8d7`; deploy `6aa0027cbaf7e10008fd01e3`, estado ready.
- Cierre con commit nuevo: `454019c`; producción nunca se modificó.
- Netlify registró el formulario `convocatoria`, ID `6aa002a1d66dd60008191ea7`,
  diez campos públicos, idioma y honeypot; `honeypot: true`.
- Pruebas sintéticas `SM054-ES-20260908`, `SM054-EN-20260908` y
  `SM054-EN-CONTROL-20260908`, con `qa@example.com`: las tres recibidas en spam.
  IDs: `6aa002f98591923d55c1ae16`, `6aa002faeba230320c83e753`,
  `6aa00334d62803258c3f9c2c`. No se las reclasificó manualmente.
- `SM055-HONEYPOT-20260908`, con el honeypot relleno: no aparece ni en spam
  ni en verificadas. No se borraron las evidencias de prueba.
- La CLI instalada no declara `state` en la operación de lectura de envíos.
  Para consultar spam se agregó ese parámetro documentado al esquema en memoria
  mediante un módulo temporal; no se modificó la instalación ni se leyeron tokens.
- GET `/en/thanks` devuelve `lang="en"` y «Thanks». **POST `/en/thanks` devuelve
  HTTP 200 con `lang="es"`, título «Gracias» y canonical `/gracias/`**.
  Request ID del caso control: `01M20GS1AA91TCSH1S2XERJD6X`.
  No es un error de rutas Astro: Netlify utiliza una sola página de éxito para
  el nombre compartido. La [respuesta de soporte de Netlify](https://answers.netlify.com/t/multilingual-website-always-shows-english-content-on-the-contact-form-custom-success-page/79249)
  documenta el mismo caso y propone nombres distintos.
- Los tests mock no podían detectar esa sustitución del servidor: validan el
  destino y el contenido local, no el procesamiento de Netlify. La DoD queda abierta.
- En esta primera prueba se propuso separar los nombres. Rubén aprobó después
  la propuesta; la implementación y el resultado están en la sección siguiente.
- GET desconocido `/en/no-existe-sm054/`: HTTP 404 y documento en inglés.
- CI remoto de la apertura: verde (49 s). Notificaciones: ninguna configurada.

Deploy cerrado `6aa00456443679000810e5e9` listo sobre `454019c`: ambas rutas
responden 200 sin `<form>` y con idioma correcto. Netlify conserva el formulario
`6aa002a1d66dd60008191ea7` y el honeypot activo.

## Decisión aplicada — nombres por idioma y notificaciones

Rubén aprobó el 08.09.2026 separar los nombres: `convocatoria` en ES y `open-call`
en EN. Cada `form-name` coincide con su formulario. El selector del script utiliza
`data-convocatoria` y no depende del nombre. Se actualizaron AGENTS y el auditor
para reflejar la decisión, conservando las fuentes externas de solo lectura.

Notificación `submission_created` de tipo `email` configurada a
`seresmigratorios@gmail.com`, para todos los formularios del proyecto.
Hook: `6aa005439ba7d0dd0292c514`; configuración confirmada por lectura de la API.
La recepción en el buzón sigue pendiente: el conector disponible pertenece a otra
cuenta y Netlify clasificó las pruebas como spam.

Gate local repetido: 106 unitarias, check/lint/formato/build aprobados;
validación y POST simulado ES/EN con y sin JavaScript aprobados.
Auditoría incremental de contenido: sin hallazgos.

Segunda apertura temporal: `e2939ed`; deploy `6aa0058e2f07290008f4fd8a`, ready.
Netlify registró también `open-call`, ID `6aa005a10a95500008c03d87`, con honeypot.
Los dos POST reales con JavaScript deshabilitado y el email confirmado devolvieron
HTTP 200 con idioma y título correctos: `/gracias` → `es`/«Gracias» y
`/en/thanks` → `en`/«Thanks». Evidencia y request IDs en
[capturas/fase-4/SM-054-post-real-idiomas.json](capturas/fase-4/SM-054-post-real-idiomas.json).

Las entradas `SM054-NOMBRES-ES-20260908` (`6aa005df409a9b437705d67a`) y
`SM054-NOMBRES-EN-20260908` (`6aa005e1b3205d4ee1cc629d`) aparecen en spam.
Siguen siendo 0 entradas verificadas. No se reclasificaron manualmente ni se
alteró el filtro antispam para presentar la prueba como aprobada. CI remoto de
esta apertura: aprobado (48 s). Falta una prueba aceptada y confirmar que el
colectivo recibe el aviso; esta limitación mantiene abierta la DoD de Fase 4.

Cierre final: `91c42c0`; deploy `6aa0067dd54add0008c8d7b3` ready. El preview
actual devuelve HTTP 200 y no contiene `<form>` en ambas rutas. La API conserva
los dos IDs y `honeypot: true`. Build y verificación local cerrada aprobados;
CI de este cierre aprobado (47 s).

Para completar la prueba de recepción desde un navegador humano, sigue disponible
la [versión de prueba abierta](https://6aa0058e2f07290008f4fd8a--seres-migratorios.netlify.app/convocatoria/),
verificada por GET; no cambia el estado cerrado del preview actual ni de producción.
Rubén debe confirmar la recepción en el buzón del colectivo y aprobar el preview
antes del merge. La recepción de correo no se da por verificada con un HTTP 200.
