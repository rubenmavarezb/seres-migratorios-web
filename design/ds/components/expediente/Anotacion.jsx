import React from "react";

/** Anotación manuscrita en azul-marcador, rotada, superpuesta. Con `src` usa la letra real escaneada. */
export function Anotacion({ children, src, alt, rotacion = -3, tamano = "var(--tipo-manuscrita)", ancho, mayusculas = false, style, className }) {
  const rot = `rotate(${rotacion}deg)`;
  if (src) {
    return <img className={className} src={src} alt={alt || (typeof children === "string" ? children : "")} data-rotacion style={{ display: "block", width: ancho || "auto", maxWidth: "100%", height: "auto", transform: rot, ...style }} />;
  }
  return (
    <span className={className} data-rotacion style={{ display: "inline-block", fontFamily: "var(--fuente-manuscrita)", color: "var(--azul-marcador)", fontSize: tamano, lineHeight: "var(--tipo-manuscrita-line-height)", transform: rot, textTransform: mayusculas ? "uppercase" : "none", letterSpacing: mayusculas ? "0.08em" : "0", maxWidth: ancho, ...style }}>
      {children}
    </span>
  );
}
