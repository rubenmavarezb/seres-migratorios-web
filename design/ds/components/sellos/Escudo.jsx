import React from "react";

/** Escudo nacional de Venezuela en azul-sello con arco de 8 estrellas. Siempre imagen; nunca redibujado. */
export function Escudo({ src, alt = "Escudo nacional de Venezuela en azul de sello con arco de ocho estrellas", ancho = 340, rotacion = 0, style, className }) {
  if (!src) return <div className={className} style={{ width: ancho, aspectRatio: "529 / 653", border: "2px dashed var(--azul-sello)", color: "var(--azul-sello)", fontFamily: "var(--fuente-mono)", fontSize: 12, display: "grid", placeItems: "center", textTransform: "uppercase", ...style }}>[ESCUDO: falta src]</div>;
  return <img className={className} src={src} alt={alt} data-rotacion style={{ display: "block", width: ancho, height: "auto", transform: rotacion ? `rotate(${rotacion}deg)` : "none", ...style }} />;
}
