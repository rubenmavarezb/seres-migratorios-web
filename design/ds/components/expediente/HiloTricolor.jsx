import React from "react";

/** Línea de 3 px en tres tramos iguales amarillo / azul / rojo. Único uso del tricolor en la UI. */
export function HiloTricolor({ alto = 3, ancho = "100%", style, className }) {
  return <div className={className} role="presentation" style={{ height: alto, width: ancho, background: "linear-gradient(90deg, var(--tricolor-amarillo) 0 33.34%, var(--tricolor-azul) 33.34% 66.67%, var(--tricolor-rojo) 66.67% 100%)", ...style }} />;
}
