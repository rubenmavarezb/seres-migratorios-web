import React from "react";

/** Botón: mono 700 mayúsculas, borde 2 px, padding 14×24, min 44 px. Hover invierte. Variante sello en azul. */
export function Boton({ children, variante = "tinta", href, onClick, type = "button", disabled = false, chico = false, ancho, style, className, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sello = variante === "sello";
  const color = disabled ? "var(--grafito)" : sello ? (active ? "var(--azul-profundo)" : hover ? "var(--azul-profundo)" : "var(--azul-sello)") : "var(--tinta)";
  const inv = (hover || active) && !disabled;
  const s = {
    fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: chico ? "0.75rem" : "var(--tipo-etiqueta)",
    border: `2px solid ${color}`, background: inv ? color : "var(--papel-puro)", color: inv ? "var(--papel)" : color,
    padding: chico ? "8px 16px" : "14px 24px", minHeight: chico ? 36 : "var(--altura-interactiva)", width: ancho, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxSizing: "border-box", borderRadius: 0, cursor: disabled ? "not-allowed" : "pointer", textDecoration: "none", appearance: "none", lineHeight: 1.2,
    transition: "background-color var(--duracion-rapida) ease, color var(--duracion-rapida) ease", opacity: disabled ? 0.7 : 1, ...style,
  };
  const ev = { onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setActive(false); }, onMouseDown: () => setActive(true), onMouseUp: () => setActive(false) };
  if (href && !disabled) return <a href={href} onClick={onClick} className={className} style={s} {...ev} {...rest}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={className} style={s} {...ev} {...rest}>{children}</button>;
}
