/* @ds-bundle: {"format":4,"namespace":"SeresMigratoriosDesignSystem_0c7dc7","components":[{"name":"FranjaAliados","sourcePath":"components/aliados/FranjaAliados.jsx"},{"name":"Anotacion","sourcePath":"components/expediente/Anotacion.jsx"},{"name":"Aparejo","sourcePath":"components/expediente/Aparejo.jsx"},{"name":"BloqueFicha","sourcePath":"components/expediente/BloqueFicha.jsx"},{"name":"CajaNombre","sourcePath":"components/expediente/CajaNombre.jsx"},{"name":"HiloTricolor","sourcePath":"components/expediente/HiloTricolor.jsx"},{"name":"PalabrasClave","sourcePath":"components/expediente/PalabrasClave.jsx"},{"name":"TitularPartido","sourcePath":"components/expediente/TitularPartido.jsx"},{"name":"Boton","sourcePath":"components/formularios/Boton.jsx"},{"name":"Campo","sourcePath":"components/formularios/Campo.jsx"},{"name":"FichaFotografo","sourcePath":"components/fotos/FichaFotografo.jsx"},{"name":"FotoPegada","sourcePath":"components/fotos/FotoPegada.jsx"},{"name":"Nav","sourcePath":"components/navegacion/Nav.jsx"},{"name":"Pie","sourcePath":"components/navegacion/Pie.jsx"},{"name":"Escudo","sourcePath":"components/sellos/Escudo.jsx"},{"name":"Sello","sourcePath":"components/sellos/Sello.jsx"},{"name":"SelloHorario","sourcePath":"components/sellos/SelloHorario.jsx"}],"sourceHashes":{"components/aliados/FranjaAliados.jsx":"d3360b0eb57b","components/expediente/Anotacion.jsx":"0a6e8a9c2c83","components/expediente/Aparejo.jsx":"8aa408fdedca","components/expediente/BloqueFicha.jsx":"8bc520bc9b02","components/expediente/CajaNombre.jsx":"0b77e9cbe681","components/expediente/HiloTricolor.jsx":"e6b47fcaad0b","components/expediente/PalabrasClave.jsx":"cd9db27c81fd","components/expediente/TitularPartido.jsx":"259857ecc3a4","components/formularios/Boton.jsx":"511654dd164a","components/formularios/Campo.jsx":"c885c98bc2de","components/fotos/FichaFotografo.jsx":"b9048cb694c4","components/fotos/FotoPegada.jsx":"7415fc6cbada","components/navegacion/Nav.jsx":"5296a44c3390","components/navegacion/Pie.jsx":"33ae888148e5","components/sellos/Escudo.jsx":"3d487ed5b5e2","components/sellos/Sello.jsx":"eeba7f655e23","components/sellos/SelloHorario.jsx":"02a456b5436c","ui_kits/piezas/Post.jsx":"32057beaea81","ui_kits/piezas/datos.jsx":"3e1ff1b7d0c8","ui_kits/web/Convocatoria.jsx":"27eb4bf6a0b7","ui_kits/web/Fotografos.jsx":"27562220edb2","ui_kits/web/Home.jsx":"394df208aa1b","ui_kits/web/Manifiesto.jsx":"c80c6c58e73f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SeresMigratoriosDesignSystem_0c7dc7 = window.SeresMigratoriosDesignSystem_0c7dc7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/aliados/FranjaAliados.jsx
try { (() => {
/** Logos de aliados en fila, altura uniforme 32–40 px, monocromo azul-sello salvo el tricolor de manos. */
function FranjaAliados({
  aliados = [],
  alto = 36,
  gap = 40,
  justificar = "center",
  style,
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: justificar,
      gap,
      ...style
    }
  }, aliados.map((a, i) => {
    const img = /*#__PURE__*/React.createElement("img", {
      src: a.src,
      alt: a.alt || a.nombre || "[ALIADO]",
      style: {
        display: "block",
        height: alto,
        width: "auto"
      }
    });
    return a.href ? /*#__PURE__*/React.createElement("a", {
      key: i,
      href: a.href,
      style: {
        display: "block",
        lineHeight: 0
      }
    }, img) : /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "block",
        lineHeight: 0
      }
    }, img);
  }));
}
Object.assign(__ds_scope, { FranjaAliados });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/aliados/FranjaAliados.jsx", error: String((e && e.message) || e) }); }

// components/expediente/Anotacion.jsx
try { (() => {
/** Anotación manuscrita en azul-marcador, rotada, superpuesta. Con `src` usa la letra real escaneada. */
function Anotacion({
  children,
  src,
  alt,
  rotacion = -3,
  tamano = "var(--tipo-manuscrita)",
  ancho,
  mayusculas = false,
  style,
  className
}) {
  const rot = `rotate(${rotacion}deg)`;
  if (src) {
    return /*#__PURE__*/React.createElement("img", {
      className: className,
      src: src,
      alt: alt || (typeof children === "string" ? children : ""),
      "data-rotacion": true,
      style: {
        display: "block",
        width: ancho || "auto",
        maxWidth: "100%",
        height: "auto",
        transform: rot,
        ...style
      }
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    "data-rotacion": true,
    style: {
      display: "inline-block",
      fontFamily: "var(--fuente-manuscrita)",
      color: "var(--azul-marcador)",
      fontSize: tamano,
      lineHeight: "var(--tipo-manuscrita-line-height)",
      transform: rot,
      textTransform: mayusculas ? "uppercase" : "none",
      letterSpacing: mayusculas ? "0.08em" : "0",
      maxWidth: ancho,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Anotacion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/Anotacion.jsx", error: String((e && e.message) || e) }); }

// components/expediente/BloqueFicha.jsx
try { (() => {
const wrap = {
  display: "grid",
  gap: "var(--espacio-5)",
  fontFamily: "var(--fuente-mono)",
  color: "var(--tinta)"
};
const etiqueta = {
  fontFamily: "var(--fuente-mono)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
  fontSize: "var(--tipo-etiqueta)",
  lineHeight: 1.35,
  margin: 0
};
const valor = {
  fontFamily: "var(--fuente-mono)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
  fontSize: "var(--tipo-etiqueta)",
  lineHeight: 1.35,
  margin: 0,
  whiteSpace: "pre-line"
};

/** Encabezado de expediente: FECHA: / HORARIOS: / LUGAR: con el valor debajo. */
function BloqueFicha({
  fecha = "[FECHA]",
  horarios = "[HORARIO]",
  lugar = "[LUGAR]",
  extras = [],
  items: itemsProp,
  columnas,
  apilado = false,
  tamano = "md",
  style,
  className
}) {
  const items = itemsProp || [{
    etiqueta: "Fecha:",
    valor: fecha
  }, {
    etiqueta: "Horarios:",
    valor: horarios
  }, {
    etiqueta: "Lugar:",
    valor: lugar
  }, ...extras];
  const cols = columnas || items.length;
  const fs = tamano === "lg" ? "1.125rem" : tamano === "sm" ? "0.75rem" : "var(--tipo-etiqueta)";
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      ...wrap,
      gridTemplateColumns: apilado ? "1fr" : `repeat(${cols}, minmax(0, 1fr))`,
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...etiqueta,
      fontSize: fs
    }
  }, it.etiqueta), /*#__PURE__*/React.createElement("p", {
    style: {
      ...valor,
      fontSize: fs
    }
  }, Array.isArray(it.valor) ? it.valor.join("\n") : it.valor))));
}
Object.assign(__ds_scope, { BloqueFicha });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/BloqueFicha.jsx", error: String((e && e.message) || e) }); }

// components/expediente/CajaNombre.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tonos = {
  tinta: "var(--tinta)",
  grafito: "var(--grafito)",
  sello: "var(--azul-sello)"
};

/** Caja de nombre: mono 700 mayúsculas, borde 2 px, fondo papel-puro. Radio 0. */
function CajaNombre({
  children,
  href,
  onClick,
  chica = false,
  tono = "tinta",
  activo = false,
  style,
  className,
  ...rest
}) {
  const color = tonos[tono] || tono;
  const base = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
    fontSize: chica ? "0.75rem" : "var(--tipo-etiqueta)",
    border: `2px solid ${color}`,
    background: activo ? color : "var(--papel-puro)",
    color: activo ? "var(--papel)" : color,
    padding: chica ? "6px 12px" : "12px 24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: chica ? 32 : "var(--altura-interactiva)",
    boxSizing: "border-box",
    textDecoration: "none",
    borderRadius: 0,
    whiteSpace: "nowrap",
    cursor: href || onClick ? "pointer" : "default",
    ...style
  };
  const Tag = href ? "a" : onClick ? "button" : "span";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick,
    className: className,
    style: Tag === "button" ? {
      ...base,
      appearance: "none"
    } : base
  }, rest), children);
}
Object.assign(__ds_scope, { CajaNombre });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/CajaNombre.jsx", error: String((e && e.message) || e) }); }

// components/expediente/Aparejo.jsx
try { (() => {
/** Aparejo de ladrillo: filas alternadas (3/2 en post, 2/1 en story) de CajaNombre, centradas. */
function Aparejo({
  nombres = [],
  filas = [3, 2],
  hrefs = {},
  chica = false,
  gapFila = "var(--espacio-4)",
  gapCaja = "var(--espacio-5)",
  style,
  className
}) {
  const rows = [];
  let i = 0,
    r = 0;
  while (i < nombres.length) {
    const n = filas[r % filas.length];
    rows.push(nombres.slice(i, i + n));
    i += n;
    r++;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: gapFila,
      ...style
    }
  }, rows.map((row, ri) => /*#__PURE__*/React.createElement("div", {
    key: ri,
    style: {
      display: "flex",
      justifyContent: "center",
      gap: gapCaja,
      flexWrap: "wrap"
    }
  }, row.map(nombre => /*#__PURE__*/React.createElement(__ds_scope.CajaNombre, {
    key: nombre,
    chica: chica,
    href: hrefs[nombre]
  }, nombre)))));
}
Object.assign(__ds_scope, { Aparejo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/Aparejo.jsx", error: String((e && e.message) || e) }); }

// components/expediente/HiloTricolor.jsx
try { (() => {
/** Línea de 3 px en tres tramos iguales amarillo / azul / rojo. Único uso del tricolor en la UI. */
function HiloTricolor({
  alto = 3,
  ancho = "100%",
  style,
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    role: "presentation",
    style: {
      height: alto,
      width: ancho,
      background: "linear-gradient(90deg, var(--tricolor-amarillo) 0 33.34%, var(--tricolor-azul) 33.34% 66.67%, var(--tricolor-rojo) 66.67% 100%)",
      ...style
    }
  });
}
Object.assign(__ds_scope, { HiloTricolor });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/HiloTricolor.jsx", error: String((e && e.message) || e) }); }

// components/expediente/PalabrasClave.jsx
try { (() => {
/** FAMILIA / RESILIENCIA / EXILIO apiladas en display azul-sello con grano de sello. */
function PalabrasClave({
  src,
  palabras = ["Familia", "Resiliencia", "Exilio"],
  vertical = false,
  tamano = "3rem",
  alinear = "center",
  color = "var(--azul-sello)",
  grano = true,
  style,
  className
}) {
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: palabras.join(" · "),
    className: className,
    style: {
      display: "block",
      height: `calc(${tamano} * 3.2)`,
      width: "auto",
      transform: vertical ? "rotate(-90deg)" : "none",
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: [grano ? "sello-grano" : "", className].filter(Boolean).join(" "),
    "aria-label": palabras.join(" · "),
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: alinear === "left" ? "flex-start" : alinear === "right" ? "flex-end" : "center",
      fontFamily: "var(--fuente-display)",
      textTransform: "uppercase",
      lineHeight: 1.05,
      letterSpacing: "0.06em",
      fontSize: tamano,
      color,
      writingMode: vertical ? "vertical-rl" : "horizontal-tb",
      transform: vertical ? "rotate(180deg)" : "none",
      ...style
    }
  }, palabras.map(p => /*#__PURE__*/React.createElement("span", {
    key: p
  }, p)));
}
Object.assign(__ds_scope, { PalabrasClave });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/PalabrasClave.jsx", error: String((e && e.message) || e) }); }

// components/expediente/TitularPartido.jsx
try { (() => {
const sizes = {
  xl: "var(--tipo-display-xl)",
  lg: "var(--tipo-display-lg)",
  md: "var(--tipo-display-md)"
};

/** SERES arriba / MIGRATORIOS abajo en display, con un slot en el medio. */
function TitularPartido({
  arriba = "Seres",
  abajo = "Migratorios",
  tamano = "xl",
  children,
  gap = "var(--espacio-5)",
  color = "var(--tinta)",
  alinear = "center",
  style,
  className
}) {
  const t = {
    fontFamily: "var(--fuente-display)",
    fontWeight: 400,
    textTransform: "uppercase",
    lineHeight: "var(--tipo-display-line-height)",
    letterSpacing: "var(--tipo-display-letter-spacing)",
    fontSize: sizes[tamano] || tamano,
    color,
    margin: 0,
    textAlign: alinear
  };
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: alinear === "left" ? "flex-start" : alinear === "right" ? "flex-end" : "center",
      gap,
      ...style
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: t
  }, arriba), children != null && /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      position: "relative"
    }
  }, children), /*#__PURE__*/React.createElement("h1", {
    style: t,
    "aria-hidden": false
  }, abajo));
}
Object.assign(__ds_scope, { TitularPartido });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/expediente/TitularPartido.jsx", error: String((e && e.message) || e) }); }

// components/formularios/Boton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Botón: mono 700 mayúsculas, borde 2 px, padding 14×24, min 44 px. Hover invierte. Variante sello en azul. */
function Boton({
  children,
  variante = "tinta",
  href,
  onClick,
  type = "button",
  disabled = false,
  chico = false,
  ancho,
  style,
  className,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sello = variante === "sello";
  const color = disabled ? "var(--grafito)" : sello ? active ? "var(--azul-profundo)" : hover ? "var(--azul-profundo)" : "var(--azul-sello)" : "var(--tinta)";
  const inv = (hover || active) && !disabled;
  const s = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
    fontSize: chico ? "0.75rem" : "var(--tipo-etiqueta)",
    border: `2px solid ${color}`,
    background: inv ? color : "var(--papel-puro)",
    color: inv ? "var(--papel)" : color,
    padding: chico ? "8px 16px" : "14px 24px",
    minHeight: chico ? 36 : "var(--altura-interactiva)",
    width: ancho,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxSizing: "border-box",
    borderRadius: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    appearance: "none",
    lineHeight: 1.2,
    transition: "background-color var(--duracion-rapida) ease, color var(--duracion-rapida) ease",
    opacity: disabled ? 0.7 : 1,
    ...style
  };
  const ev = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  };
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    className: className,
    style: s
  }, ev, rest), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: onClick,
    disabled: disabled,
    className: className,
    style: s
  }, ev, rest), children);
}
Object.assign(__ds_scope, { Boton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/formularios/Boton.jsx", error: String((e && e.message) || e) }); }

// components/formularios/Campo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Campo de formulario de papel: etiqueta mono 700 arriba, input con borde inferior 2 px. */
function Campo({
  etiqueta,
  nombre,
  tipo = "text",
  valor,
  onChange,
  placeholder,
  opciones = [],
  error,
  ayuda,
  requerido = false,
  filas = 4,
  deshabilitado = false,
  style,
  className
}) {
  const [foco, setFoco] = React.useState(false);
  const id = nombre || React.useId();
  const borde = error ? "var(--color-error)" : foco ? "var(--azul-sello)" : "var(--tinta)";
  const lab = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
    fontSize: "var(--tipo-etiqueta)",
    color: error ? "var(--color-error)" : "var(--tinta)",
    display: "block"
  };
  const inp = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 400,
    fontSize: "var(--tipo-cuerpo)",
    lineHeight: 1.4,
    color: "var(--tinta)",
    background: "transparent",
    border: 0,
    borderBottom: `2px solid ${borde}`,
    borderRadius: 0,
    padding: "10px 0",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    minHeight: tipo === "textarea" ? undefined : "var(--altura-interactiva)",
    appearance: "none",
    resize: "vertical",
    opacity: deshabilitado ? 0.6 : 1
  };
  const common = {
    id,
    name: nombre,
    value: valor,
    onChange,
    placeholder,
    required: requerido,
    disabled: deshabilitado,
    onFocus: () => setFoco(true),
    onBlur: () => setFoco(false),
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined
  };
  const msg = (t, c, k) => /*#__PURE__*/React.createElement("span", {
    id: `${id}-${k}`,
    style: {
      fontFamily: "var(--fuente-mono)",
      fontSize: "var(--tipo-metadatos)",
      color: c,
      display: "block",
      lineHeight: 1.4
    }
  }, t);
  if (tipo === "checkbox") {
    return /*#__PURE__*/React.createElement("label", {
      className: className,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        fontFamily: "var(--fuente-mono)",
        fontSize: "var(--tipo-metadatos)",
        lineHeight: 1.5,
        color: "var(--tinta)",
        ...style
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: id,
      name: nombre,
      checked: !!valor,
      onChange: onChange,
      required: requerido,
      disabled: deshabilitado,
      onFocus: () => setFoco(true),
      onBlur: () => setFoco(false),
      style: {
        appearance: "none",
        width: 20,
        height: 20,
        minWidth: 20,
        margin: 2,
        border: `2px solid ${borde}`,
        borderRadius: 0,
        background: valor ? "var(--tinta)" : "var(--papel-puro)",
        boxShadow: valor ? "inset 0 0 0 3px var(--papel-puro)" : "none",
        cursor: "pointer"
      }
    }), /*#__PURE__*/React.createElement("span", null, etiqueta, requerido && " *", error && msg(error, "var(--color-error)", "error")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      ...style
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: lab
  }, etiqueta, requerido && " *"), tipo === "textarea" ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: filas,
    style: inp
  }, common)) : tipo === "select" ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    style: {
      ...inp,
      paddingRight: 28,
      cursor: "pointer"
    }
  }, common), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), opciones.map(o => typeof o === "string" ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.valor,
    value: o.valor
  }, o.etiqueta))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: 4,
      top: "50%",
      transform: "translateY(-60%)",
      fontFamily: "var(--fuente-mono)",
      fontWeight: 700,
      pointerEvents: "none"
    }
  }, "v")) : /*#__PURE__*/React.createElement("input", _extends({
    type: tipo,
    style: inp
  }, common)), error ? msg(error, "var(--color-error)", "error") : ayuda ? msg(ayuda, "var(--grafito)", "ayuda") : null);
}
Object.assign(__ds_scope, { Campo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/formularios/Campo.jsx", error: String((e && e.message) || e) }); }

// components/fotos/FichaFotografo.jsx
try { (() => {
/** Ficha de fotógrafo: "001 NOMBRE", foto principal, retrato chico superpuesto, frase manuscrita, firma, Instagram. */
function FichaFotografo({
  numero,
  nombre = "[NOMBRE]",
  foto,
  fotoAlt = "",
  retrato,
  retratoAlt,
  fraseManuscrita,
  frase,
  firma,
  instagram,
  href,
  ancho = 420,
  altoFoto,
  retratoTamano = [120, 150],
  style,
  className
}) {
  const enc = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
    fontSize: "var(--tipo-etiqueta)",
    color: "var(--tinta)",
    margin: 0
  };
  const rw = Array.isArray(retratoTamano) ? retratoTamano[0] : retratoTamano,
    rh = Array.isArray(retratoTamano) ? retratoTamano[1] : retratoTamano * 1.25;
  return /*#__PURE__*/React.createElement("article", {
    className: className,
    style: {
      width: ancho,
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "var(--espacio-3)",
      fontFamily: "var(--fuente-mono)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: enc
  }, numero ? `${numero} ` : "", href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: "inherit",
      textDecoration: "none"
    }
  }, nombre) : nombre), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingLeft: retrato ? rw * 0.35 : 0,
      paddingBottom: retrato ? rh * 0.45 : 0
    }
  }, foto ? /*#__PURE__*/React.createElement("img", {
    src: foto,
    alt: fotoAlt,
    style: {
      display: "block",
      width: "100%",
      height: altoFoto || "auto",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "3 / 2",
      background: "var(--azul-tinta-agua)",
      display: "grid",
      placeItems: "center",
      fontSize: 12,
      textTransform: "uppercase",
      color: "var(--azul-profundo)"
    }
  }, "[FOTO PRINCIPAL]"), retrato && /*#__PURE__*/React.createElement("img", {
    src: retrato,
    alt: retratoAlt || `Retrato de ${nombre}`,
    style: {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: rw,
      height: rh,
      objectFit: "cover",
      display: "block"
    }
  })), (fraseManuscrita || frase) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--espacio-2)"
    }
  }, fraseManuscrita ? /*#__PURE__*/React.createElement(__ds_scope.Anotacion, {
    src: fraseManuscrita,
    alt: frase || "",
    rotacion: -1,
    ancho: "100%"
  }) : /*#__PURE__*/React.createElement(__ds_scope.Anotacion, {
    rotacion: -1,
    tamano: "1.375rem"
  }, frase), firma && /*#__PURE__*/React.createElement("img", {
    src: firma,
    alt: `Firma de ${nombre}`,
    style: {
      alignSelf: "flex-end",
      height: 40,
      width: "auto"
    }
  })), instagram && /*#__PURE__*/React.createElement("a", {
    href: `https://instagram.com/${instagram.replace("@", "")}`,
    style: {
      fontFamily: "var(--fuente-mono)",
      fontWeight: 700,
      fontSize: "var(--tipo-metadatos)",
      letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
      color: "var(--azul-sello)",
      textUnderlineOffset: 3
    }
  }, instagram));
}
Object.assign(__ds_scope, { FichaFotografo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fotos/FichaFotografo.jsx", error: String((e && e.message) || e) }); }

// components/fotos/FotoPegada.jsx
try { (() => {
/** Foto pegada: borde papel-puro, sombra única, rotación leve. Variantes recortada y sangrada. */
function FotoPegada({
  src,
  alt = "",
  variante = "pegada",
  rotacion = 0,
  ancho,
  alto,
  pie,
  credito,
  posicion = "50% 50%",
  borde = "var(--foto-borde)",
  style,
  className
}) {
  const img = /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      display: "block",
      width: "100%",
      height: alto ? "100%" : "auto",
      objectFit: "cover",
      objectPosition: posicion
    }
  });
  const rot = rotacion && variante !== "sangrada" ? `rotate(${rotacion}deg)` : "none";
  const base = {
    display: "inline-block",
    boxSizing: "border-box",
    width: ancho,
    height: alto,
    transform: rot,
    ...style
  };
  if (variante === "sangrada") return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      ...base,
      overflow: "hidden"
    }
  }, img);
  const figura = variante === "recortada" ? base : {
    ...base,
    background: "var(--papel-puro)",
    padding: borde,
    boxShadow: "var(--sombra-foto)"
  };
  return /*#__PURE__*/React.createElement("figure", {
    className: className,
    "data-rotacion": true,
    style: {
      margin: 0,
      ...figura
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: alto ? `calc(100% - 2 * ${variante === "recortada" ? "0px" : borde})` : "auto",
      overflow: "hidden"
    }
  }, img), (pie || credito) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: "var(--fuente-mono)",
      fontSize: "var(--tipo-metadatos)",
      color: "var(--grafito)",
      paddingTop: "var(--espacio-2)",
      lineHeight: 1.4
    }
  }, pie, pie && credito ? " · " : "", credito));
}
Object.assign(__ds_scope, { FotoPegada });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fotos/FotoPegada.jsx", error: String((e && e.message) || e) }); }

// components/navegacion/Nav.jsx
try { (() => {
const defaultLinks = [{
  etiqueta: "Manifiesto",
  href: "#manifiesto"
}, {
  etiqueta: "Fotógrafos",
  href: "#fotografos"
}, {
  etiqueta: "Ediciones",
  href: "#ediciones"
}, {
  etiqueta: "Convocatoria",
  href: "#convocatoria"
}, {
  etiqueta: "Apoyar",
  href: "#apoyar"
}];

/** Barra estilo ficha: marca en display-md, links mono 700 mayúsculas, selector ES / EN. Mobile: menú a pantalla completa. */
function Nav({
  marca = "Seres Migratorios",
  hrefMarca = "#",
  links = defaultLinks,
  activo,
  idioma = "ES",
  idiomas = ["ES", "EN"],
  onIdioma,
  onNavegar,
  mobile = false,
  style,
  className
}) {
  const [abierto, setAbierto] = React.useState(false);
  const link = (l, grande) => {
    const act = activo === l.etiqueta || activo === l.href;
    return /*#__PURE__*/React.createElement("a", {
      key: l.etiqueta,
      href: l.href,
      onClick: e => {
        if (onNavegar) {
          e.preventDefault();
          onNavegar(l);
        }
        setAbierto(false);
      },
      style: grande ? {
        fontFamily: "var(--fuente-display)",
        textTransform: "uppercase",
        fontSize: "var(--tipo-display-lg)",
        lineHeight: 0.9,
        color: act ? "var(--azul-sello)" : "var(--tinta)",
        textDecoration: "none"
      } : {
        fontFamily: "var(--fuente-mono)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
        fontSize: "var(--tipo-etiqueta)",
        color: act ? "var(--azul-sello)" : "var(--tinta)",
        textDecoration: act ? "underline" : "none",
        textUnderlineOffset: 4,
        textDecorationThickness: 2,
        padding: "12px 0",
        display: "inline-block"
      }
    }, l.etiqueta);
  };
  const selector = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    },
    role: "group",
    "aria-label": "Idioma"
  }, idiomas.map(i => /*#__PURE__*/React.createElement(__ds_scope.CajaNombre, {
    key: i,
    chica: true,
    activo: i === idioma,
    onClick: () => onIdioma && onIdioma(i),
    "aria-pressed": i === idioma
  }, i)));
  return /*#__PURE__*/React.createElement("header", {
    className: className,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--espacio-5)",
      padding: mobile ? "12px var(--margen-mobile)" : "16px var(--margen-desktop)",
      borderBottom: "1px solid var(--linea)",
      background: "var(--papel)",
      position: "relative",
      zIndex: "var(--z-flotante)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: hrefMarca,
    style: {
      fontFamily: "var(--fuente-display)",
      textTransform: "uppercase",
      lineHeight: 0.85,
      letterSpacing: "-0.01em",
      fontSize: mobile ? "1.75rem" : "var(--tipo-display-md)",
      color: "var(--tinta)",
      textDecoration: "none",
      whiteSpace: "nowrap"
    }
  }, marca), mobile ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setAbierto(true),
    "aria-expanded": abierto,
    "aria-label": "Abrir men\xFA",
    style: {
      fontFamily: "var(--fuente-mono)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      fontSize: "0.75rem",
      border: "2px solid var(--tinta)",
      background: "var(--papel-puro)",
      padding: "6px 12px",
      minHeight: 44,
      cursor: "pointer",
      borderRadius: 0
    }
  }, "Men\xFA") : /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--espacio-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--espacio-5)",
      flexWrap: "wrap"
    }
  }, links.map(l => link(l, false))), selector), mobile && abierto && /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    className: "papel",
    style: {
      position: "absolute",
      inset: 0,
      height: "100vh",
      minHeight: 600,
      zIndex: "var(--z-modal)",
      padding: "var(--margen-mobile)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "var(--espacio-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, selector, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAbierto(false),
    "aria-label": "Cerrar men\xFA",
    style: {
      fontFamily: "var(--fuente-mono)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      fontSize: "0.75rem",
      border: "2px solid var(--tinta)",
      background: "var(--tinta)",
      color: "var(--papel)",
      padding: "6px 12px",
      minHeight: 44,
      cursor: "pointer",
      borderRadius: 0
    }
  }, "Cerrar")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--espacio-4)"
    }
  }, links.map(l => link(l, true)))));
}
Object.assign(__ds_scope, { Nav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navegacion/Nav.jsx", error: String((e && e.message) || e) }); }

// components/sellos/Escudo.jsx
try { (() => {
/** Escudo nacional de Venezuela en azul-sello con arco de 8 estrellas. Siempre imagen; nunca redibujado. */
function Escudo({
  src,
  alt = "Escudo nacional de Venezuela en azul de sello con arco de ocho estrellas",
  ancho = 340,
  rotacion = 0,
  style,
  className
}) {
  if (!src) return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: ancho,
      aspectRatio: "529 / 653",
      border: "2px dashed var(--azul-sello)",
      color: "var(--azul-sello)",
      fontFamily: "var(--fuente-mono)",
      fontSize: 12,
      display: "grid",
      placeItems: "center",
      textTransform: "uppercase",
      ...style
    }
  }, "[ESCUDO: falta src]");
  return /*#__PURE__*/React.createElement("img", {
    className: className,
    src: src,
    alt: alt,
    "data-rotacion": true,
    style: {
      display: "block",
      width: ancho,
      height: "auto",
      transform: rotacion ? `rotate(${rotacion}deg)` : "none",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Escudo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sellos/Escudo.jsx", error: String((e && e.message) || e) }); }

// components/sellos/Sello.jsx
try { (() => {
const star = "0,-7 1.57,-2.16 6.66,-2.16 2.54,0.83 4.11,5.66 0,2.67 -4.11,5.66 -2.54,0.83 -6.66,-2.16 -1.57,-2.16";

/** Sello circular SVG en azul-sello: texto en arco, ciudad y fecha, tres estrellas, anillo doble, grano. */
function Sello({
  src,
  texto = "Seres Migratorios",
  ciudad = "Buenos Aires",
  fecha = "08 ago 2026",
  tamano = 200,
  rotacion = -12,
  color = "var(--azul-sello)",
  grano = true,
  style,
  className
}) {
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: `Sello ${texto}, ${ciudad}, ${fecha}`,
    className: className,
    "data-rotacion": true,
    style: {
      display: "block",
      width: tamano,
      height: tamano,
      objectFit: "contain",
      transform: rotacion ? `rotate(${rotacion}deg)` : "none",
      flexShrink: 0,
      ...style
    }
  });
  const id = React.useId().replace(/:/g, "");
  const t = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 700,
    fill: color,
    textTransform: "uppercase"
  };
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 190 190",
    width: tamano,
    height: tamano,
    className: [grano ? "sello-grano" : "", className].filter(Boolean).join(" "),
    role: "img",
    "aria-label": `Sello ${texto}, ${ciudad}, ${fecha}`,
    "data-rotacion": true,
    style: {
      transform: `rotate(${rotacion}deg)`,
      overflow: "visible",
      display: "block",
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
    id: `arco-${id}`,
    d: "M 16,95 A 79,79 0 0 1 174,95",
    fill: "none"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "95",
    cy: "95",
    r: "88",
    fill: "none",
    stroke: color,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "95",
    cy: "95",
    r: "70",
    fill: "none",
    stroke: color,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("text", {
    style: t,
    fontSize: "13",
    letterSpacing: "3.2",
    textAnchor: "middle"
  }, /*#__PURE__*/React.createElement("textPath", {
    href: `#arco-${id}`,
    startOffset: "50%"
  }, texto.toUpperCase())), /*#__PURE__*/React.createElement("text", {
    style: t,
    x: "95",
    y: "90",
    fontSize: "13",
    letterSpacing: "1",
    textAnchor: "middle"
  }, ciudad.toUpperCase()), /*#__PURE__*/React.createElement("text", {
    style: t,
    x: "95",
    y: "112",
    fontSize: "13",
    letterSpacing: "1",
    textAnchor: "middle"
  }, fecha.toUpperCase()), /*#__PURE__*/React.createElement("g", {
    fill: color
  }, /*#__PURE__*/React.createElement("polygon", {
    points: star,
    transform: "translate(69,140)"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: star,
    transform: "translate(95,140)"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: star,
    transform: "translate(121,140)"
  })));
}
Object.assign(__ds_scope, { Sello });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sellos/Sello.jsx", error: String((e && e.message) || e) }); }

// components/navegacion/Pie.jsx
try { (() => {
/** Pie: FranjaAliados + HiloTricolor + Sello chico + contacto mono + "¡Aguante la fotografía!" manuscrito. */
function Pie({
  aliados = [],
  contacto = [{
    etiqueta: "Email:",
    valor: "[EMAIL DE CONTACTO]"
  }, {
    etiqueta: "Instagram:",
    valor: "[INSTAGRAM DEL PROYECTO]"
  }],
  cierre = "¡Aguante la fotografía!",
  cierreSrc,
  ciudad,
  fecha,
  mobile = false,
  style,
  className
}) {
  const et = {
    fontFamily: "var(--fuente-mono)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
    fontSize: "var(--tipo-etiqueta)",
    margin: 0,
    lineHeight: 1.4
  };
  const val = {
    fontFamily: "var(--fuente-mono)",
    fontSize: "var(--tipo-etiqueta)",
    margin: 0,
    lineHeight: 1.4,
    color: "var(--tinta-suave)",
    wordBreak: "break-word"
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: className,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--espacio-6)",
      padding: mobile ? "var(--espacio-7) var(--margen-mobile)" : "var(--espacio-8) var(--margen-desktop)",
      ...style
    }
  }, aliados.length > 0 && /*#__PURE__*/React.createElement(__ds_scope.FranjaAliados, {
    aliados: aliados,
    alto: 32
  }), /*#__PURE__*/React.createElement(__ds_scope.HiloTricolor, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--espacio-6)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Sello, {
    tamano: 120,
    ciudad: ciudad,
    fecha: fecha
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: mobile ? "1fr" : "repeat(2, minmax(160px, auto))",
      gap: "var(--espacio-5) var(--espacio-7)",
      flex: 1,
      minWidth: 220
    }
  }, contacto.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    style: et
  }, c.etiqueta), c.href ? /*#__PURE__*/React.createElement("a", {
    href: c.href,
    style: {
      ...val,
      color: "var(--azul-sello)"
    }
  }, c.valor) : /*#__PURE__*/React.createElement("p", {
    style: val
  }, c.valor)))), /*#__PURE__*/React.createElement(__ds_scope.Anotacion, {
    src: cierreSrc,
    alt: cierre,
    rotacion: -2,
    tamano: "clamp(1.5rem, 3vw, 2.25rem)"
  }, cierre)));
}
Object.assign(__ds_scope, { Pie });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navegacion/Pie.jsx", error: String((e && e.message) || e) }); }

// components/sellos/SelloHorario.jsx
try { (() => {
/** Números en círculo ⑩ AM ⑦ PM y fecha corta en azul con grano. */
function SelloHorario({
  src,
  srcFecha,
  desde = "10",
  hasta = "7",
  fechaCorta = "8.8.26",
  tamano = 64,
  color = "var(--tinta)",
  colorFecha = "var(--azul-sello)",
  apilado = true,
  style,
  className
}) {
  if (src) return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexDirection: apilado ? "column" : "row",
      alignItems: apilado ? "flex-start" : "center",
      gap: tamano * 0.28,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: `${desde} AM a ${hasta} PM`,
    style: {
      display: "block",
      height: tamano * 0.9,
      width: "auto"
    }
  }), srcFecha ? /*#__PURE__*/React.createElement("img", {
    src: srcFecha,
    alt: fechaCorta,
    className: "sello-grano",
    style: {
      display: "block",
      height: tamano * 0.85,
      width: "auto"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "sello-grano",
    style: {
      fontFamily: "var(--fuente-display)",
      fontSize: tamano * 0.95,
      lineHeight: 1,
      color: colorFecha,
      letterSpacing: "0.06em"
    }
  }, fechaCorta));
  const circ = {
    width: tamano,
    height: tamano,
    border: `2px solid ${color}`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--fuente-display)",
    fontSize: tamano * 0.53,
    lineHeight: 1,
    color,
    boxSizing: "border-box",
    flexShrink: 0
  };
  const lab = {
    fontFamily: "var(--fuente-display)",
    fontSize: tamano * 0.6,
    lineHeight: 1,
    color,
    textTransform: "uppercase"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexDirection: apilado ? "column" : "row",
      alignItems: apilado ? "flex-start" : "center",
      gap: tamano * 0.28,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: tamano * 0.22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: circ
  }, desde), /*#__PURE__*/React.createElement("span", {
    style: lab
  }, "AM"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...circ,
      marginLeft: tamano * 0.2
    }
  }, hasta), /*#__PURE__*/React.createElement("span", {
    style: lab
  }, "PM")), /*#__PURE__*/React.createElement("div", {
    className: "sello-grano",
    style: {
      fontFamily: "var(--fuente-display)",
      fontSize: tamano * 0.95,
      lineHeight: 1,
      color: colorFecha,
      letterSpacing: "0.06em"
    }
  }, fechaCorta));
}
Object.assign(__ds_scope, { SelloHorario });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sellos/SelloHorario.jsx", error: String((e && e.message) || e) }); }

// ui_kits/piezas/Post.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  BloqueFicha,
  TitularPartido,
  Aparejo,
  Anotacion,
  Sello,
  Escudo,
  SelloHorario,
  FotoPegada,
  FranjaAliados
} = window.SeresMigratoriosDesignSystem_0c7dc7;
const D = window.SM_DATOS;
const ficha = {
  position: 'absolute',
  left: 135,
  top: 62,
  width: 830
};
const fichaProps = {
  fecha: D.edicion.fecha,
  horarios: D.edicion.horarios,
  lugar: D.edicion.lugar,
  tamano: 'lg',
  style: {
    gridTemplateColumns: '250px 300px 1fr'
  }
};
const tit = {
  fontSize: 150
};
const H = ({
  arriba,
  abajo,
  top,
  children,
  gap
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    left: 0,
    right: 0,
    top
  }
}, /*#__PURE__*/React.createElement(TitularPartido, {
  tamano: "150px",
  gap: gap,
  arriba: arriba,
  abajo: abajo
}, children));
const sang = (src, alt, st) => /*#__PURE__*/React.createElement(FotoPegada, {
  src: src,
  alt: alt,
  variante: "sangrada",
  style: {
    position: 'absolute',
    ...st
  }
});
function PostExponen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BloqueFicha, _extends({}, fichaProps, {
    style: {
      ...ficha,
      ...fichaProps.style
    }
  })), sang(D.A + 'fotos/local.png', '', {
    left: -190,
    top: 185,
    width: 250,
    height: 340
  }), /*#__PURE__*/React.createElement(H, {
    top: 180,
    gap: 30
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 840
    }
  }, /*#__PURE__*/React.createElement(Aparejo, {
    nombres: D.exponen,
    filas: [3, 2],
    gapCaja: 24,
    gapFila: 20,
    style: {
      fontSize: 17
    }
  }), /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/exponen.png',
    alt: "EXPONEN",
    rotacion: -1,
    ancho: 420,
    style: {
      position: 'absolute',
      right: -10,
      top: 60
    }
  }))), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 200,
    style: {
      position: 'absolute',
      left: 870,
      top: 500
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 158,
      top: 790
    }
  }, /*#__PURE__*/React.createElement(BloqueFicha, {
    items: [{
      etiqueta: 'Música:',
      valor: D.musica
    }],
    tamano: "lg"
  })), /*#__PURE__*/React.createElement(FranjaAliados, {
    aliados: D.aliados,
    alto: 44,
    gap: 40,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 62
    }
  }));
}
function PostRefugio() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BloqueFicha, _extends({}, fichaProps, {
    style: {
      ...ficha,
      ...fichaProps.style
    }
  })), sang(D.A + 'fotos/monjas.png', 'Dos monjas frente al río', {
    left: 0,
    top: 130,
    width: 220,
    height: 392
  }), sang(D.A + 'fotos/edificios.png', 'Edificios al atardecer', {
    left: 0,
    top: 590,
    width: 176,
    height: 250
  }), sang(D.A + 'fotos/sombrero.png', 'Hombre con sombrero', {
    left: 120,
    top: 790,
    width: 262,
    height: 290
  }), sang(D.A + 'fotos/vestido-azul.png', 'Mujer con vestido azul', {
    left: 870,
    top: 760,
    width: 210,
    height: 320
  }), /*#__PURE__*/React.createElement(H, {
    top: 175,
    gap: 20
  }, /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/claim-refugio.png',
    alt: "La fotograf\xEDa como refugio en el exilio",
    rotacion: 0,
    ancho: 672,
    style: {
      marginLeft: 60
    }
  })), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 200,
    style: {
      position: 'absolute',
      left: 885,
      top: 370
    }
  }), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: -30,
    tamano: 200,
    style: {
      position: 'absolute',
      left: 980,
      top: 230
    }
  }), /*#__PURE__*/React.createElement(SelloHorario, {
    src: D.marca.selloHorario,
    srcFecha: D.marca.fechaCorta,
    tamano: 64,
    style: {
      position: 'absolute',
      left: 405,
      top: 805
    }
  }));
}
function PostEscudo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BloqueFicha, _extends({}, fichaProps, {
    style: {
      ...ficha,
      ...fichaProps.style
    }
  })), sang(D.A + 'fotos/playa.png', 'Playa con montañas', {
    left: 0,
    top: 258,
    width: 292,
    height: 252
  }), sang(D.A + 'fotos/bus.png', 'Bus naranja y blanco', {
    left: 773,
    top: 213,
    width: 307,
    height: 314
  }), sang(D.A + 'fotos/bandera.png', 'Bandera venezolana', {
    left: 0,
    top: 808,
    width: 240,
    height: 272
  }), sang(D.A + 'fotos/campo.png', 'Campo con niebla', {
    left: 900,
    top: 690,
    width: 180,
    height: 390
  }), /*#__PURE__*/React.createElement(H, {
    top: 180,
    gap: 10
  }, /*#__PURE__*/React.createElement(Escudo, {
    src: D.marca.escudo,
    ancho: 300
  })), /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/claim-refugio.png',
    alt: "La fotograf\xEDa como refugio en el exilio",
    rotacion: -1,
    ancho: 600,
    style: {
      position: 'absolute',
      left: 245,
      top: 790
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: D.marca.subtitulo,
    alt: "Experiencia fotogr\xE1fica en apoyo a Venezuela",
    style: {
      position: 'absolute',
      left: 214,
      top: 930,
      width: 652
    }
  }), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 200,
    style: {
      position: 'absolute',
      left: 940,
      top: 610
    }
  }));
}
function PiezaPost({
  variante = 'exponen'
}) {
  const V = variante === 'refugio' ? PostRefugio : variante === 'escudo' ? PostEscudo : PostExponen;
  return /*#__PURE__*/React.createElement("div", {
    className: "papel",
    "data-screen-label": `Post ${variante}`,
    style: {
      width: 1080,
      height: 1080,
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--papel-puro)'
    }
  }, /*#__PURE__*/React.createElement(V, null));
}
Object.assign(window, {
  PiezaPost
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/piezas/Post.jsx", error: String((e && e.message) || e) }); }

// ui_kits/piezas/datos.jsx
try { (() => {
// Datos confirmados de la edición 01 (BRIEF §1). Nada fuera de esta lista.
const A = '../../assets/';
window.SM_DATOS = {
  edicion: {
    fecha: '08.08.2026',
    horarios: '10:00 AM - 19:00',
    lugar: ['Consulado', 'Humberto Primo, 3032', 'Buenos Aires, ARG'],
    ciudad: 'Buenos Aires',
    fechaSello: '08 ago 2026',
    fechaCorta: '8.8.26'
  },
  exponen: ['Gabriela Rondón', 'Rubén Mavarez', 'Leo Simmons', 'Daniela Barbera', 'Angela Pérez', 'Sofía Martín', 'Rona Rangel', 'Kremlin Prieto', 'Gustavo Sánchez'],
  todos: ['Gabriela Rondón', 'Rubén Mavarez', 'Leo Simmons', 'Daniela Barbera', 'Angela Pérez', 'Sofía Martín', 'Rona Rangel', 'Kremlin Prieto', 'Gustavo Sánchez', 'Herick Frontado', 'Pati Caro', 'Naia Guanipa', 'Andrea Cubillán', 'Carlos Vázquez'],
  musica: ['MIG', 'HOOCH', 'NAIA', 'MAVAREZ', 'GROOVE CARGO', 'RAWM'],
  aliados: [{
    src: A + 'logos/consulado.png',
    alt: 'CONSULADO Custom & Craft'
  }, {
    src: A + 'logos/manos-tricolor.png',
    alt: '[ALIADO LOGO TRICOLOR — a confirmar]',
    color: true
  }, {
    src: A + 'logos/infiltrado.png',
    alt: 'infiltrado™'
  }, {
    src: A + 'logos/ccc.png',
    alt: 'CCC [a confirmar]'
  }],
  fotean: [{
    numero: '001',
    nombre: 'Herick Frontado',
    instagram: '@herickfrontado',
    foto: A + 'obra/herick-frontado-01.png',
    retrato: A + 'retratos/herick-frontado.png',
    fraseManuscrita: A + 'manuscritas/frase-herick-frontado.png',
    firma: A + 'manuscritas/firma-herick-frontado.png',
    frase: 'El suspiro involuntario al verme rodeado de mi gente, como quien ve tierra firme en el horizonte.'
  }, {
    numero: '002',
    nombre: 'Naia Guanipa',
    instagram: '@naianaianaia',
    foto: A + 'obra/naia-guanipa-01.png',
    fraseManuscrita: A + 'manuscritas/frase-naia-guanipa.png',
    frase: 'La Raíz es mi contención. La fotografía experimental me permite crear un lugar donde el tiempo deja de separarnos. En los retratos de doble exposición, un hermano habita en el otro. Las pieles se encuentran, se mezclan y permanecen. Suponer el tiempo es una manera de seguir juntos. Hacer de la fotografía nuestro refugio. — Nayara Guanipa Barreto'
  }, {
    numero: '003',
    nombre: 'Angela Pérez',
    instagram: '@angelaluisap',
    foto: A + 'obra/angela-perez-01.png',
    retrato: A + 'retratos/angela-perez.png',
    fraseManuscrita: A + 'manuscritas/frase-angela-perez.png',
    frase: 'Habitar con fe los nuevos espacios, reconstruir la identidad en ellos y transmitir esa esperanza a las personas con las que comparto.'
  }, {
    numero: '004',
    nombre: 'Pati Caro',
    instagram: '[@huella.solar — a confirmar]',
    foto: A + 'obra/pati-caro-01.png',
    retrato: A + 'retratos/pati-caro.png',
    fraseManuscrita: A + 'manuscritas/frase-pati-caro.png',
    frase: '[TRANSCRIPCIÓN FRASE PATI CARO]'
  }, {
    numero: '005',
    nombre: 'Andrea Cubillán',
    instagram: '@andreacubillany',
    foto: A + 'obra/andrea-cubillan-01.png',
    retrato: A + 'retratos/andrea-cubillan.png',
    fraseManuscrita: A + 'manuscritas/frase-andrea-cubillan.png',
    firma: A + 'manuscritas/firma-andrea-cubillan.png',
    frase: 'La conexión con mi raíz es inquebrantable, no se borra, puedo volver a mi casa a través de todo lo que permanece en mi memoria.'
  }, {
    numero: '006',
    nombre: 'Carlos Vázquez',
    instagram: '@carlsvsqz',
    foto: A + 'obra/carlos-vazquez-01.png',
    retrato: A + 'retratos/carlos-vazquez.png',
    fraseManuscrita: A + 'manuscritas/frase-carlos-vazquez.png',
    firma: A + 'manuscritas/firma-carlos-vazquez.png',
    frase: '[TRANSCRIPCIÓN FRASE CARLOS VÁZQUEZ]'
  }, {
    numero: '007',
    nombre: 'Leo Simmons',
    instagram: '[@xlsimio — a confirmar]',
    foto: A + 'obra/leo-simmons-01.png',
    retrato: A + 'retratos/leo-simmons.png',
    fraseManuscrita: A + 'manuscritas/frase-leo-simmons.png',
    frase: 'Fragmentos de una memoria interrumpida que sobrevive y encuentra en la fotografía una forma de permanecer.'
  }],
  obraExponen: {
    'Rubén Mavarez': A + 'obra/ruben-mavarez-01.png',
    'Kremlin Prieto': A + 'obra/kremlin-prieto-01.png',
    'Sofía Martín': A + 'obra/sofia-martin-01.png',
    'Gustavo Sánchez': A + 'obra/gustavo-sanchez-01.png'
  },
  marca: {
    escudo: A + 'marca/escudo.png',
    sello: A + 'marca/sello.png',
    selloHorario: A + 'marca/sello-horario.png',
    fechaCorta: A + 'marca/fecha-corta-8-8-26.png',
    palabrasClave: A + 'marca/palabras-clave.png',
    subtitulo: A + 'marca/subtitulo-experiencia.png'
  },
  manifiesto: 'En la vorágine de la rutina en el exilio buscamos la manera de ayudar, de agruparnos y compartir esto que sentimos en el pecho, de mirar a los ojos a quienes comparten un dolor que no se puede describir en palabras y que tratamos de codificar en una imagen, un retrato. En momentos como estos entendemos la importancia de la fotografía, y de nuestra labor como fotograf@s',
  A
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/piezas/datos.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Convocatoria.jsx
try { (() => {
const {
  Anotacion,
  CajaNombre,
  Campo,
  Boton,
  Sello
} = window.SeresMigratoriosDesignSystem_0c7dc7;
const D = window.SM_DATOS;
function Convocatoria({
  ir
}) {
  const [abierta, setAbierta] = React.useState(true);
  const [v, setV] = React.useState({
    nombre: '',
    ciudad: '',
    pais: '',
    email: '',
    instagram: '',
    portfolio: '',
    disciplina: '',
    edicion: '[NOMBRE EDICIÓN 02]',
    mensaje: '',
    ok: false
  });
  const [enviado, setEnviado] = React.useState(false);
  const [errores, setErrores] = React.useState({});
  const set = k => e => setV({
    ...v,
    [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  });
  const enviar = e => {
    e.preventDefault();
    const err = {};
    if (!v.nombre) err.nombre = 'Falta tu nombre.';
    if (!/@/.test(v.email)) err.email = 'Revisá el email: falta la arroba.';
    if (!v.disciplina) err.disciplina = 'Elegí una disciplina.';
    if (!v.ok) err.ok = 'Necesitamos tu consentimiento para guardar los datos.';
    setErrores(err);
    if (!Object.keys(err).length) setEnviado(true);
  };
  const paso = (n, t) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-4)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      border: '2px solid var(--tinta)',
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--fuente-display)',
      fontSize: 22,
      flexShrink: 0
    }
  }, n), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo",
    style: {
      paddingTop: 10
    }
  }, t));
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      paddingBottom: 'var(--espacio-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h2",
    style: {
      fontSize: 'var(--tipo-display-lg)'
    }
  }, "Convocatoria"), /*#__PURE__*/React.createElement(Anotacion, {
    rotacion: -3,
    tamano: "2.5rem",
    style: {
      position: 'absolute',
      right: -40,
      top: -30
    }
  }, "Postulate")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-4)',
      alignItems: 'center',
      marginTop: 'var(--espacio-6)',
      flexWrap: 'wrap'
    }
  }, abierta ? /*#__PURE__*/React.createElement(CajaNombre, null, "Abierta hasta [Fecha cierre]") : /*#__PURE__*/React.createElement(CajaNombre, {
    tono: "grafito"
  }, "Convocatoria cerrada"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAbierta(!abierta),
    className: "meta",
    style: {
      background: 'none',
      border: 0,
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: 0
    }
  }, "(prototipo: alternar estado)"))), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      paddingTop: 0,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 'var(--espacio-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Qu\xE9 buscamos"), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "Buscamos fot\xF3graf@s, gente de film y m\xFAsica de la di\xE1spora venezolana para la pr\xF3xima edici\xF3n de Seres Migratorios. Si quer\xE9s sumar tu mirada al recorrido o exponer tu obra, postulate. Toooda ayuda es bienvenida."), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo",
    style: {
      color: 'var(--grafito)'
    }
  }, "[DETALLE DE LA CONVOCATORIA 02: qu\xE9 se busca, cu\xE1ntos sets, condiciones]")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "C\xF3mo funciona el recorrido"), paso(1, 'Quien participa hace un aporte solidario.'), paso(2, 'Pasa por los sets del fotógrafo 001 al 007.'), paso(3, 'Cada fotógrafo imprime su visión y las fotos se envían por email.'))), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)',
      position: 'relative'
    }
  }, !abierta ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)',
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "La convocatoria para la pr\xF3xima edici\xF3n est\xE1 cerrada. Cuando abra, la anunciamos por Instagram y ac\xE1 mismo."), /*#__PURE__*/React.createElement(Boton, {
    variante: "sello",
    href: "#",
    style: {
      alignSelf: 'flex-start'
    }
  }, "Seguinos en Instagram")) : enviado ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 200
  }), /*#__PURE__*/React.createElement("h2", {
    className: "h2",
    style: {
      fontSize: 'var(--tipo-display-lg)'
    }
  }, "Gracias"), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "Recibimos tu postulaci\xF3n. Te va a llegar un mail de confirmaci\xF3n. Si no aparece, revis\xE1 el spam."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-4)'
    }
  }, /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Inicio')
  }, "Volver al inicio"), /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Fotógrafos')
  }, "Ver los fot\xF3grafos"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: enviar,
    noValidate: true,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: 'var(--espacio-6) var(--espacio-7)',
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Nombre",
    nombre: "nombre",
    valor: v.nombre,
    onChange: set('nombre'),
    requerido: true,
    error: errores.nombre
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Email",
    tipo: "email",
    nombre: "email",
    valor: v.email,
    onChange: set('email'),
    requerido: true,
    error: errores.email
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Ciudad",
    nombre: "ciudad",
    valor: v.ciudad,
    onChange: set('ciudad')
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Pa\xEDs",
    nombre: "pais",
    valor: v.pais,
    onChange: set('pais')
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Instagram",
    nombre: "instagram",
    valor: v.instagram,
    onChange: set('instagram'),
    placeholder: "@"
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Portfolio (URL)",
    tipo: "url",
    nombre: "portfolio",
    valor: v.portfolio,
    onChange: set('portfolio')
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Disciplina",
    tipo: "select",
    nombre: "disciplina",
    valor: v.disciplina,
    onChange: set('disciplina'),
    placeholder: "Eleg\xED una",
    opciones: ['Fotografía', 'Film', 'Música', 'Otro'],
    error: errores.disciplina
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Edici\xF3n a la que te postul\xE1s",
    nombre: "edicion",
    valor: v.edicion,
    onChange: set('edicion')
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Mensaje corto",
    tipo: "textarea",
    nombre: "mensaje",
    filas: 3,
    valor: v.mensaje,
    onChange: set('mensaje'),
    style: {
      gridColumn: '1 / -1'
    }
  }), /*#__PURE__*/React.createElement(Campo, {
    etiqueta: "Acepto que Seres Migratorios guarde mis datos para gestionar esta convocatoria.",
    tipo: "checkbox",
    nombre: "ok",
    valor: v.ok,
    onChange: set('ok'),
    error: errores.ok,
    style: {
      gridColumn: '1 / -1'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "_gotcha",
    tabIndex: -1,
    autoComplete: "off",
    style: {
      display: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Boton, {
    type: "submit"
  }, "Enviar postulaci\xF3n"))), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 160,
    style: {
      position: 'absolute',
      right: 'var(--margen-desktop)',
      bottom: 'var(--espacio-6)'
    }
  })), /*#__PURE__*/React.createElement("section", {
    className: "contenedor",
    style: {
      paddingBottom: 'var(--espacio-8)'
    }
  }, /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Ediciones')
  }, "Ver la primera edici\xF3n")));
}
Object.assign(window, {
  Convocatoria
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Convocatoria.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Fotografos.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Anotacion,
  CajaNombre,
  FichaFotografo,
  Aparejo,
  Sello,
  Boton
} = window.SeresMigratoriosDesignSystem_0c7dc7;
const D = window.SM_DATOS;
function Fotografos({
  ir
}) {
  const [filtro, setFiltro] = React.useState('Todos');
  const filtros = ['Todos', 'Fotean', 'Exponen', 'Film', 'Música'];
  const verFotean = filtro === 'Todos' || filtro === 'Fotean' || filtro === 'Film';
  const verExponen = filtro === 'Todos' || filtro === 'Exponen';
  const fotean = filtro === 'Film' ? D.fotean.filter(f => ['006', '007'].includes(f.numero)) : D.fotean;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      paddingBottom: 'var(--espacio-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h2",
    style: {
      fontSize: 'var(--tipo-display-lg)'
    }
  }, "Fot\xF3grafos"), /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/fotografos.png',
    alt: "FOT\xD3GRAFOS",
    rotacion: -3,
    ancho: 360,
    style: {
      position: 'absolute',
      left: '55%',
      top: -30
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-3)',
      flexWrap: 'wrap',
      marginTop: 'var(--espacio-6)'
    },
    role: "tablist"
  }, filtros.map(f => /*#__PURE__*/React.createElement(CajaNombre, {
    key: f,
    chica: true,
    activo: filtro === f,
    onClick: () => setFiltro(f),
    role: "tab",
    "aria-selected": filtro === f
  }, f)))), verFotean && /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "meta",
    style: {
      margin: '0 0 var(--espacio-6)'
    }
  }, "Sets del recorrido 001\u2013007 \xB7 Edici\xF3n 01, Buenos Aires"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--espacio-8) var(--espacio-6)'
    }
  }, fotean.map(f => /*#__PURE__*/React.createElement(FichaFotografo, _extends({
    key: f.numero
  }, f, {
    ancho: "100%",
    altoFoto: 220,
    retratoTamano: [88, 110],
    href: "#"
  }))))), verExponen && /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      marginBottom: 'var(--espacio-7)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Exponen"), /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/exponen.png',
    alt: "EXPONEN",
    rotacion: -2,
    ancho: 260,
    style: {
      position: 'absolute',
      left: 120,
      top: -14
    }
  })), /*#__PURE__*/React.createElement(Aparejo, {
    nombres: D.exponen,
    filas: [3, 2],
    hrefs: {
      'Rubén Mavarez': '#'
    }
  }), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 160,
    style: {
      position: 'absolute',
      right: 'var(--margen-desktop)',
      top: 'var(--espacio-6)'
    }
  })), filtro === 'Música' && /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "etiqueta",
    style: {
      lineHeight: 1.5
    }
  }, "M\xFAsica:", /*#__PURE__*/React.createElement("br", null), D.musica.join(' / '))), /*#__PURE__*/React.createElement("section", {
    className: "contenedor",
    style: {
      paddingBottom: 'var(--espacio-8)'
    }
  }, /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Convocatoria')
  }, "Postulate a la pr\xF3xima")));
}
Object.assign(window, {
  Fotografos
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Fotografos.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  BloqueFicha,
  TitularPartido,
  Anotacion,
  Sello,
  FotoPegada,
  Boton,
  PalabrasClave,
  FichaFotografo,
  FranjaAliados,
  CajaNombre
} = window.SeresMigratoriosDesignSystem_0c7dc7;
const D = window.SM_DATOS;
function Home({
  ir
}) {
  const destacados = D.fotean.filter(f => f.fraseManuscrita);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      paddingBottom: 'var(--espacio-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement(BloqueFicha, {
    fecha: "[Pr\xF3xima edici\xF3n a confirmar]",
    horarios: "[A confirmar]",
    lugar: "[A confirmar]"
  }), /*#__PURE__*/React.createElement(Anotacion, {
    rotacion: -2,
    tamano: "1.75rem",
    style: {
      position: 'absolute',
      right: 0,
      top: -18
    }
  }, "La pr\xF3xima se anuncia por ac\xE1")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-4)',
      marginTop: 'var(--espacio-5)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Ediciones')
  }, "Ver la \xFAltima edici\xF3n"), /*#__PURE__*/React.createElement(Boton, {
    variante: "sello",
    href: "#"
  }, "Seguinos en Instagram"))), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--espacio-7) 0 var(--espacio-9)'
    }
  }, /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.A + 'fotos/monjas.png',
    alt: "Dos monjas frente al r\xEDo",
    variante: "sangrada",
    style: {
      position: 'absolute',
      left: 0,
      top: 40,
      width: 200,
      height: 360
    }
  }), /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.A + 'fotos/bus.png',
    alt: "Bus naranja y blanco",
    variante: "sangrada",
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 260,
      height: 260
    }
  }), /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.A + 'fotos/campo.png',
    alt: "Campo con niebla",
    variante: "sangrada",
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 150,
      height: 300
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "contenedor",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(TitularPartido, {
    gap: "var(--espacio-4)"
  }, /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/claim-refugio.png',
    alt: "La fotograf\xEDa como refugio en el exilio",
    rotacion: 0,
    ancho: "min(560px, 60vw)"
  })), /*#__PURE__*/React.createElement(Sello, {
    src: D.marca.sello,
    rotacion: 0,
    tamano: 180,
    style: {
      position: 'absolute',
      right: 60,
      bottom: -20
    }
  }))), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      gap: 'var(--espacio-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "\"", D.manifiesto, "\""), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Post oficial del 31 de julio de 2026"), /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Manifiesto'),
    style: {
      alignSelf: 'flex-start'
    }
  }, "Leer el manifiesto")), /*#__PURE__*/React.createElement(PalabrasClave, {
    src: D.marca.palabrasClave,
    tamano: "3.5rem"
  })), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 'var(--espacio-7)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Fot\xF3grafos"), /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/fotografos.png',
    alt: "FOT\xD3GRAFOS",
    rotacion: -2,
    ancho: 260,
    style: {
      position: 'absolute',
      left: 140,
      top: -22
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 'var(--espacio-7) var(--espacio-6)'
    }
  }, destacados.map(f => /*#__PURE__*/React.createElement(FichaFotografo, _extends({
    key: f.numero
  }, f, {
    ancho: "100%",
    altoFoto: 200,
    retratoTamano: [72, 90],
    href: "#"
  })))), /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Fotógrafos'),
    style: {
      marginTop: 'var(--espacio-7)'
    }
  }, "Ver todos los fot\xF3grafos")), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 'var(--espacio-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "C\xF3mo apoyar"), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "Cada edici\xF3n recauda fondos para las v\xEDctimas de los terremotos en Venezuela. Pod\xE9s aportar, comprar copias, sumarte como voluntario o compartir las convocatorias. Toooda ayuda es bienvenida."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Boton, {
    variante: "sello",
    href: "#"
  }, "Aportar"), /*#__PURE__*/React.createElement(Boton, {
    onClick: () => ir('Convocatoria')
  }, "Postulate"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--espacio-5)',
      justifyContent: 'center',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.A + 'fotos/flores.png',
    alt: "Flores rosadas",
    ancho: 200,
    rotacion: -2,
    credito: "[AUTOR]"
  }), /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.A + 'fotos/faro.png',
    alt: "Dos monjas mirando un faro",
    ancho: 240,
    rotacion: 1.5,
    credito: "[AUTOR]"
  }))), /*#__PURE__*/React.createElement("section", {
    className: "contenedor",
    style: {
      padding: 'var(--espacio-6) var(--margen-desktop) var(--espacio-4)'
    }
  }, /*#__PURE__*/React.createElement(FranjaAliados, {
    aliados: D.aliados,
    alto: 40
  })));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Manifiesto.jsx
try { (() => {
const {
  TitularPartido,
  Escudo,
  Anotacion,
  FotoPegada,
  PalabrasClave,
  BloqueFicha,
  Boton,
  SelloHorario,
  Aparejo,
  FranjaAliados
} = window.SeresMigratoriosDesignSystem_0c7dc7;
const D = window.SM_DATOS;
function Manifiesto({
  ir
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "contenedor",
    style: {
      padding: 'var(--espacio-8) var(--margen-desktop) var(--espacio-7)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(TitularPartido, {
    tamano: "lg",
    gap: "var(--espacio-3)"
  }, /*#__PURE__*/React.createElement(Escudo, {
    src: D.marca.escudo,
    ancho: 200
  })), /*#__PURE__*/React.createElement("img", {
    src: D.marca.subtitulo,
    alt: "Experiencia fotogr\xE1fica en apoyo a Venezuela",
    style: {
      display: 'block',
      margin: 'var(--espacio-5) auto 0',
      width: 'min(520px, 80%)'
    }
  })), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
      gap: 'var(--espacio-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Manifiesto"), /*#__PURE__*/React.createElement("blockquote", {
    className: "cuerpo",
    style: {
      fontSize: '1.125rem',
      margin: 0
    }
  }, "\"", D.manifiesto, "\""), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Post oficial del evento, 31 de julio de 2026")), /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.obraExponen['Rubén Mavarez'],
    alt: "Obra de Rub\xE9n Mavarez",
    ancho: "100%",
    rotacion: 1.5,
    credito: "[AUTOR]"
  })), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
      gap: 'var(--espacio-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(FotoPegada, {
    src: D.obraExponen['Kremlin Prieto'],
    alt: "Obra de Kremlin Prieto",
    ancho: "100%",
    rotacion: -1.5,
    credito: "[AUTOR]"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "C\xF3mo naci\xF3"), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "Seres Migratorios naci\xF3 en julio de 2026 con un reel de Herick Frontado convocando fot\xF3graf@s venezolan@s para una jornada de documentaci\xF3n fotogr\xE1fica cuyo objetivo era recaudar fondos para las v\xEDctimas de los terremotos en Venezuela."), /*#__PURE__*/React.createElement("p", {
    className: "cuerpo"
  }, "La primera edici\xF3n fue un recorrido fotogr\xE1fico por siete sets, una exposici\xF3n impresa de nueve artistas venezolan@s en venta, m\xFAsica en vivo, caf\xE9 de especialidad y postres venezolanos."), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/reel/DavMRiQJ9uB/",
    className: "etiqueta",
    style: {
      alignSelf: 'flex-start'
    }
  }, "Ver el reel del 13.07.2026"), /*#__PURE__*/React.createElement(PalabrasClave, {
    src: D.marca.palabrasClave,
    tamano: "2.75rem",
    style: {
      marginTop: 'var(--espacio-4)'
    }
  }))), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      borderTop: '1px solid var(--linea)'
    },
    "data-screen-label": "Edici\xF3n 01"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 'var(--espacio-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--espacio-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Edici\xF3n 01 \xB7 Buenos Aires"), /*#__PURE__*/React.createElement(BloqueFicha, {
    fecha: D.edicion.fecha,
    horarios: D.edicion.horarios,
    lugar: D.edicion.lugar
  })), /*#__PURE__*/React.createElement(SelloHorario, {
    src: D.marca.selloHorario,
    srcFecha: D.marca.fechaCorta,
    tamano: 56,
    apilado: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--espacio-7)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 'var(--espacio-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "etiqueta",
    style: {
      margin: '0 0 var(--espacio-4)'
    }
  }, "Fotean:"), /*#__PURE__*/React.createElement(Aparejo, {
    nombres: D.fotean.map(f => f.nombre),
    filas: [2, 1],
    gapCaja: 16,
    gapFila: 12,
    style: {
      alignItems: 'flex-start'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "etiqueta",
    style: {
      margin: '0 0 var(--espacio-4)'
    }
  }, "Exponen:"), /*#__PURE__*/React.createElement(Aparejo, {
    nombres: D.exponen,
    filas: [2, 1],
    gapCaja: 16,
    gapFila: 12,
    style: {
      alignItems: 'flex-start'
    }
  }), /*#__PURE__*/React.createElement(Anotacion, {
    src: D.A + 'manuscritas/exponen.png',
    alt: "EXPONEN",
    rotacion: -3,
    ancho: 200,
    style: {
      position: 'absolute',
      right: 0,
      top: -30
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "etiqueta",
    style: {
      marginTop: 'var(--espacio-7)',
      lineHeight: 1.5
    }
  }, "M\xFAsica:", /*#__PURE__*/React.createElement("br", null), D.musica.join(' / ')), /*#__PURE__*/React.createElement("p", {
    className: "meta",
    style: {
      marginTop: 'var(--espacio-6)'
    }
  }, "Las fotos del d\xEDa se publican ac\xE1 cuando est\xE9n listas."), /*#__PURE__*/React.createElement(FranjaAliados, {
    aliados: D.aliados,
    alto: 36,
    style: {
      marginTop: 'var(--espacio-7)'
    }
  })), /*#__PURE__*/React.createElement("section", {
    className: "contenedor seccion",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--espacio-7)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Anotacion, {
    rotacion: -2,
    tamano: "2.25rem"
  }, "Unidos por la reconstrucci\xF3n"), /*#__PURE__*/React.createElement(Boton, {
    variante: "sello",
    onClick: () => ir('Apoyar')
  }, "C\xF3mo apoyar")));
}
Object.assign(window, {
  Manifiesto
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Manifiesto.jsx", error: String((e && e.message) || e) }); }

__ds_ns.FranjaAliados = __ds_scope.FranjaAliados;

__ds_ns.Anotacion = __ds_scope.Anotacion;

__ds_ns.Aparejo = __ds_scope.Aparejo;

__ds_ns.BloqueFicha = __ds_scope.BloqueFicha;

__ds_ns.CajaNombre = __ds_scope.CajaNombre;

__ds_ns.HiloTricolor = __ds_scope.HiloTricolor;

__ds_ns.PalabrasClave = __ds_scope.PalabrasClave;

__ds_ns.TitularPartido = __ds_scope.TitularPartido;

__ds_ns.Boton = __ds_scope.Boton;

__ds_ns.Campo = __ds_scope.Campo;

__ds_ns.FichaFotografo = __ds_scope.FichaFotografo;

__ds_ns.FotoPegada = __ds_scope.FotoPegada;

__ds_ns.Nav = __ds_scope.Nav;

__ds_ns.Pie = __ds_scope.Pie;

__ds_ns.Escudo = __ds_scope.Escudo;

__ds_ns.Sello = __ds_scope.Sello;

__ds_ns.SelloHorario = __ds_scope.SelloHorario;

})();
