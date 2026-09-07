# Movimiento y animación — propuesta de sección §11 para el Design System v1.2

**Estado: APROBADA por el tech lead el 06.09.2026 e integrada como §11 de `design-system.md` (v1.2).** La versión normativa es la de `design-system.md`; este archivo queda como registro de la propuesta y de los tres ajustes con que se aprobó:

1. Las transiciones entre páginas se hacen con View Transitions **cross-document** por CSS (`@view-transition { navigation: auto }` + `view-transition-name`), **sin `<ClientRouter />`**: cero JavaScript de navegación y el POST del formulario de convocatoria (Netlify Forms) nunca queda interceptado por un router. Si algún día se adopta `<ClientRouter />`, el `<form>` lleva `data-astro-reload`.
2. El escalonado del `Aparejo` se resuelve **por fila** (cada fila es una unidad `[data-entrada]`), sin CSS generado por índice; `--desfase-entrada` queda solo para las entradas por carga del hero.
3. El barrido del `HiloTricolor` se aprueba **solo en el `Pie`** (una vez por página) y sujeto a prueba en dispositivo: si se lee como barra de carga, queda estático.

Tokens nuevos ya agregados a `tokens.css`, `tokens.json` y `tailwind-theme.css`: `--duracion-entrada: 350ms` y `--desfase-entrada: 40ms`. Los bloques CSS de entrada (`[data-entrada]`, `[data-entrada="sello"]`, `[data-entrada="hilo"]`) y la regla `@view-transition` están en esos dos archivos CSS, dentro de `@media (prefers-reduced-motion: no-preference)` y `@supports`.

Fecha de la propuesta: 06.09.2026 · Autor: asistente de marca, a pedido de Rubén.

---

## OBSERVACIÓN previa: esto cambia una regla vigente

El `readme.md` del design system en Claude Design, sección Movimiento, decía:

> "Casi nulo: transiciones 150 ms (hover) y 250 ms (menú mobile, lightbox), ease. Las rotaciones son estáticas; prefers-reduced-motion las anula. Sin fades de entrada, sin bounces, sin parallax."

Esta propuesta **levanta la prohibición de fades de entrada** y la reemplaza por un permiso acotado. Mantiene intacta la prohibición de bounces y parallax. El párrafo del `readme.md` en Claude Design se corrige en consecuencia.

---

## 11. Movimiento (texto de la propuesta)

### 11.1 Principio

El movimiento del sistema es el de un objeto de papel, no el de una app. Una foto que se apoya, un sello que estampa, una ficha que entra en el campo de visión. Nada flota, nada rebota, nada se arma letra por letra en pantalla. Si una animación llama la atención sobre sí misma, está mal.

Regla operativa: **si al quitar la animación la página se ve igual de bien, la animación está bien calibrada.** El movimiento acompaña la lectura; no la produce.

### 11.2 Sin librerías

Todo el movimiento del sitio se resuelve con CSS nativo. No se incorporan librerías de animación al proyecto: ni Framer Motion, ni GSAP, ni Motion, ni kits de componentes animados. Razones: el sitio es `output: 'static'` sin framework de UI (sumar React solo para animar costaría unos 60 kb de JS), y los kits disponibles vienen con una estética de glows, degradados y esquinas redondeadas incompatible con §3 y §5.

Si en el futuro aparece una secuencia que CSS no puede expresar, se evalúa el paquete `motion` (vanilla, unos pocos kb, funciona en un `<script>` de Astro sin islas) como excepción documentada, nunca como dependencia por defecto.

### 11.3 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--duracion-rapida` | `150ms` | Hover y foco: links, `Boton`, `CajaNombre`. |
| `--duracion-media` | `250ms` | Menú mobile de `Nav`, lightbox de `/artistas/[slug]`. |
| `--duracion-entrada` | `350ms` | Entradas por carga de página (hero). No aplica a las de scroll: ahí la duración la fija el rango, no el reloj. |
| `--desfase-entrada` | `40ms` | Escalonado entre hermanos en las entradas por carga. |

Curvas: `ease` para hover y estados, `ease-out` para entradas. Ninguna curva con overshoot ni `cubic-bezier` con rebote.

### 11.4 Qué se anima

| Componente | Gesto | Cómo |
|---|---|---|
| `Sello` | Estampado: opacidad de 0 a 1 con `scale` de 1.06 a 1. | Entrada por scroll. Nunca gira al aparecer: la rotación de -12° es estática. |
| `FotoPegada` | Se apoya: opacidad más `translate` de 12 px hacia arriba. | Entrada por scroll. |
| `FichaFotografo` | Igual que `FotoPegada`. | Entrada por scroll. |
| `CajaNombre` en `Aparejo` | Entrada fila por fila. | Entrada por scroll. |
| `HiloTricolor` | Barrido horizontal de izquierda a derecha con `clip-path`. | Solo en el Pie. Único movimiento donde participa el tricolor. |
| `Boton`, links, `Nav` | Cambio de color de fondo y texto. | Transición de `--duracion-rapida`, como hoy. |
| `Nav` mobile, lightbox | Apertura y cierre. | `@starting-style` + `transition-behavior: allow-discrete` sobre `<dialog>`, `--duracion-media`. |
| Cambio de página | Transición del titular entre Home e internas. | View Transitions cross-document con `view-transition-name`. |

### 11.5 Qué no se anima

- **`TitularPartido`.** Es el ancla de lectura de la página y tiene que estar sólido desde el primer frame. Sin entrada, sin escalonado, sin texto que se arma.
- **`BloqueFicha`.** Es un dato duro: fecha, horario y lugar aparecen o no aparecen.
- **Texto letra por letra, palabra por palabra, o máquina de escribir.** La tipografía mono ya evoca la máquina; simularla en movimiento la vuelve efecto.
- **Parallax, bounce, loops infinitos, spinners decorativos, hover que agranda fotos.**
- **Las rotaciones existentes.** Las de `FotoPegada`, `Anotacion` y `Sello` son estáticas y así quedan. Ninguna animación las anima ni las pisa.
- **Nada por debajo del pliegue que retenga contenido esencial**: el sitio tiene que leerse completo con JavaScript deshabilitado y sin soporte de animaciones.

### 11.6 Implementación

Las entradas por scroll van con scroll-driven animations de CSS (`animation-timeline: view()`), sin JavaScript ni `IntersectionObserver`. Dos envoltorios son **obligatorios** en cada bloque de animación de entrada:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports ((animation-timeline: view()) and (animation-range: entry)) {

    @keyframes entrada-papel {
      from { opacity: 0; translate: 0 12px; }
    }

    [data-entrada] {
      animation: entrada-papel auto ease-out backwards;
      animation-timeline: view();
      animation-range: entry 0% entry 60%;
    }
  }
}
```

Cuatro reglas que no son negociables:

1. **`@supports` con `animation-range: entry` incluido.** Sin esa segunda condición pasan navegadores con soporte parcial y los elementos quedan invisibles. Es la forma de romper el sitio más fácil que existe.
2. **Nada arranca oculto fuera del `@supports`.** Ningún `opacity: 0` en el CSS base. El estado inicial lo pone `backwards` desde dentro del bloque; si el bloque no aplica, el elemento simplemente está ahí, visible.
3. **Solo `opacity`, `translate`, `scale` y `clip-path`.** Nunca la propiedad `transform` a secas: `FotoPegada`, `Anotacion`, `Sello` y todo lo marcado con `[data-rotacion]` ya la usan para su rotación estática, y animarla se la borra. Las propiedades independientes (`translate`, `scale`, `rotate`) conviven con ella sin pisarla. Además son las únicas baratas de componer: nada de animar `width`, `height`, `top` o `margin`.
4. **`animation-duration: auto`** en las animaciones de scroll. Con una view timeline la duración la define `animation-range`, no el reloj; `--duracion-entrada` es para las entradas por carga.

Para las transiciones entre páginas, `@view-transition { navigation: auto; }` en el CSS global y `view-transition-name` sobre el elemento que persiste. Los navegadores sin soporte las ignoran, así que la degradación ya viene resuelta.

### 11.7 Movimiento reducido

`prefers-reduced-motion: reduce` es el estado por defecto de esta sección, no una excepción: todo el movimiento de 11.4 vive dentro de `@media (prefers-reduced-motion: no-preference)`, así que con la preferencia activada el sitio queda exactamente como el diseño aprobado el 06.09.2026, sin una sola entrada.

Sigue vigente el bloque de `tokens.css` que además neutraliza las rotaciones estáticas de `.foto-pegada`, `.manuscrita`, `[class*="sello"]`, `[class*="anotacion"]` y `[data-rotacion]`, y fuerza `scroll-behavior: auto`. Las View Transitions también se desactivan bajo esa preferencia.

---

## Pendientes que quedan

- Corregir el párrafo "Movimiento" del `readme.md` del design system en Claude Design.
- Verificar en dispositivo real que el barrido del `HiloTricolor` no se lea como un elemento de carga; si se lee así, se quita.
