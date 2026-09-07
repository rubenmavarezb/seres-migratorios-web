import React from "react";

const tonos = { tinta: "var(--tinta)", grafito: "var(--grafito)", sello: "var(--azul-sello)" };

/** Caja de nombre: mono 700 mayúsculas, borde 2 px, fondo papel-puro. Radio 0. */
export function CajaNombre({ children, href, onClick, chica = false, tono = "tinta", activo = false, style, className, ...rest }) {
  const color = tonos[tono] || tono;
  const base = {
    fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)",
    fontSize: chica ? "0.75rem" : "var(--tipo-etiqueta)", border: `2px solid ${color}`, background: activo ? color : "var(--papel-puro)",
    color: activo ? "var(--papel)" : color, padding: chica ? "6px 12px" : "12px 24px", display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: chica ? 32 : "var(--altura-interactiva)", boxSizing: "border-box", textDecoration: "none", borderRadius: 0, whiteSpace: "nowrap", cursor: href || onClick ? "pointer" : "default", ...style,
  };
  const Tag = href ? "a" : onClick ? "button" : "span";
  return <Tag href={href} onClick={onClick} className={className} style={Tag === "button" ? { ...base, appearance: "none" } : base} {...rest}>{children}</Tag>;
}
