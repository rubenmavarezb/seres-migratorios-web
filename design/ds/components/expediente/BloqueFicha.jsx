import React from "react";

const wrap = { display: "grid", gap: "var(--espacio-5)", fontFamily: "var(--fuente-mono)", color: "var(--tinta)" };
const etiqueta = { fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: "var(--tipo-etiqueta)", lineHeight: 1.35, margin: 0 };
const valor = { fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: "var(--tipo-etiqueta)", lineHeight: 1.35, margin: 0, whiteSpace: "pre-line" };

/** Encabezado de expediente: FECHA: / HORARIOS: / LUGAR: con el valor debajo. */
export function BloqueFicha({ fecha = "[FECHA]", horarios = "[HORARIO]", lugar = "[LUGAR]", extras = [], items: itemsProp, columnas, apilado = false, tamano = "md", style, className }) {
  const items = itemsProp || [
    { etiqueta: "Fecha:", valor: fecha },
    { etiqueta: "Horarios:", valor: horarios },
    { etiqueta: "Lugar:", valor: lugar },
    ...extras,
  ];
  const cols = columnas || items.length;
  const fs = tamano === "lg" ? "1.125rem" : tamano === "sm" ? "0.75rem" : "var(--tipo-etiqueta)";
  return (
    <div className={className} style={{ ...wrap, gridTemplateColumns: apilado ? "1fr" : `repeat(${cols}, minmax(0, 1fr))`, ...style }}>
      {items.map((it, i) => (
        <div key={i}>
          <p style={{ ...etiqueta, fontSize: fs }}>{it.etiqueta}</p>
          <p style={{ ...valor, fontSize: fs }}>{Array.isArray(it.valor) ? it.valor.join("\n") : it.valor}</p>
        </div>
      ))}
    </div>
  );
}
