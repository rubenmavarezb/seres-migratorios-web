import React from "react";

const sizes = { xl: "var(--tipo-display-xl)", lg: "var(--tipo-display-lg)", md: "var(--tipo-display-md)" };

/** SERES arriba / MIGRATORIOS abajo en display, con un slot en el medio. */
export function TitularPartido({ arriba = "Seres", abajo = "Migratorios", tamano = "xl", children, gap = "var(--espacio-5)", color = "var(--tinta)", alinear = "center", style, className }) {
  const t = { fontFamily: "var(--fuente-display)", fontWeight: 400, textTransform: "uppercase", lineHeight: "var(--tipo-display-line-height)", letterSpacing: "var(--tipo-display-letter-spacing)", fontSize: sizes[tamano] || tamano, color, margin: 0, textAlign: alinear };
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: alinear === "left" ? "flex-start" : alinear === "right" ? "flex-end" : "center", gap, ...style }}>
      <h1 style={t}>{arriba}</h1>
      {children != null && <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>{children}</div>}
      <h1 style={t} aria-hidden={false}>{abajo}</h1>
    </div>
  );
}
