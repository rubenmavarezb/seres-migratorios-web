import React from "react";

/** FAMILIA / RESILIENCIA / EXILIO apiladas en display azul-sello con grano de sello. */
export function PalabrasClave({ src, palabras = ["Familia", "Resiliencia", "Exilio"], vertical = false, tamano = "3rem", alinear = "center", color = "var(--azul-sello)", grano = true, style, className }) {
  if (src) return <img src={src} alt={palabras.join(" · ")} className={className} style={{ display: "block", height: `calc(${tamano} * 3.2)`, width: "auto", transform: vertical ? "rotate(-90deg)" : "none", ...style }} />;
  return (
    <div className={[grano ? "sello-grano" : "", className].filter(Boolean).join(" ")} aria-label={palabras.join(" · ")} style={{ display: "flex", flexDirection: "column", alignItems: alinear === "left" ? "flex-start" : alinear === "right" ? "flex-end" : "center", fontFamily: "var(--fuente-display)", textTransform: "uppercase", lineHeight: 1.05, letterSpacing: "0.06em", fontSize: tamano, color, writingMode: vertical ? "vertical-rl" : "horizontal-tb", transform: vertical ? "rotate(180deg)" : "none", ...style }}>
      {palabras.map((p) => <span key={p}>{p}</span>)}
    </div>
  );
}
