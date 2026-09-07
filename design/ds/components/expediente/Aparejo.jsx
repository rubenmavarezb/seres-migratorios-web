import React from "react";
import { CajaNombre } from "./CajaNombre.jsx";

/** Aparejo de ladrillo: filas alternadas (3/2 en post, 2/1 en story) de CajaNombre, centradas. */
export function Aparejo({ nombres = [], filas = [3, 2], hrefs = {}, chica = false, gapFila = "var(--espacio-4)", gapCaja = "var(--espacio-5)", style, className }) {
  const rows = [];
  let i = 0, r = 0;
  while (i < nombres.length) {
    const n = filas[r % filas.length];
    rows.push(nombres.slice(i, i + n));
    i += n; r++;
  }
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: gapFila, ...style }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", justifyContent: "center", gap: gapCaja, flexWrap: "wrap" }}>
          {row.map((nombre) => <CajaNombre key={nombre} chica={chica} href={hrefs[nombre]}>{nombre}</CajaNombre>)}
        </div>
      ))}
    </div>
  );
}
