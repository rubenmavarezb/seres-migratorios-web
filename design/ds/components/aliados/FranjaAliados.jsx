import React from "react";

/** Logos de aliados en fila, altura uniforme 32–40 px, monocromo azul-sello salvo el tricolor de manos. */
export function FranjaAliados({ aliados = [], alto = 36, gap = 40, justificar = "center", style, className }) {
  return (
    <div className={className} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: justificar, gap, ...style }}>
      {aliados.map((a, i) => {
        const img = <img src={a.src} alt={a.alt || a.nombre || "[ALIADO]"} style={{ display: "block", height: alto, width: "auto" }} />;
        return a.href ? <a key={i} href={a.href} style={{ display: "block", lineHeight: 0 }}>{img}</a> : <span key={i} style={{ display: "block", lineHeight: 0 }}>{img}</span>;
      })}
    </div>
  );
}
