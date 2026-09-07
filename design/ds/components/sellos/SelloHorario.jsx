import React from "react";

/** Números en círculo ⑩ AM ⑦ PM y fecha corta en azul con grano. */
export function SelloHorario({ src, srcFecha, desde = "10", hasta = "7", fechaCorta = "8.8.26", tamano = 64, color = "var(--tinta)", colorFecha = "var(--azul-sello)", apilado = true, style, className }) {
  if (src) return (
    <div className={className} style={{ display: "flex", flexDirection: apilado ? "column" : "row", alignItems: apilado ? "flex-start" : "center", gap: tamano * 0.28, ...style }}>
      <img src={src} alt={`${desde} AM a ${hasta} PM`} style={{ display: "block", height: tamano * 0.9, width: "auto" }} />
      {srcFecha ? <img src={srcFecha} alt={fechaCorta} className="sello-grano" style={{ display: "block", height: tamano * 0.85, width: "auto" }} /> : <div className="sello-grano" style={{ fontFamily: "var(--fuente-display)", fontSize: tamano * 0.95, lineHeight: 1, color: colorFecha, letterSpacing: "0.06em" }}>{fechaCorta}</div>}
    </div>
  );
  const circ = { width: tamano, height: tamano, border: `2px solid ${color}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fuente-display)", fontSize: tamano * 0.53, lineHeight: 1, color, boxSizing: "border-box", flexShrink: 0 };
  const lab = { fontFamily: "var(--fuente-display)", fontSize: tamano * 0.6, lineHeight: 1, color, textTransform: "uppercase" };
  return (
    <div className={className} style={{ display: "flex", flexDirection: apilado ? "column" : "row", alignItems: apilado ? "flex-start" : "center", gap: tamano * 0.28, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: tamano * 0.22 }}>
        <span style={circ}>{desde}</span><span style={lab}>AM</span>
        <span style={{ ...circ, marginLeft: tamano * 0.2 }}>{hasta}</span><span style={lab}>PM</span>
      </div>
      <div className="sello-grano" style={{ fontFamily: "var(--fuente-display)", fontSize: tamano * 0.95, lineHeight: 1, color: colorFecha, letterSpacing: "0.06em" }}>{fechaCorta}</div>
    </div>
  );
}
