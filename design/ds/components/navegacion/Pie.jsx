import React from "react";
import { FranjaAliados } from "../aliados/FranjaAliados.jsx";
import { HiloTricolor } from "../expediente/HiloTricolor.jsx";
import { Sello } from "../sellos/Sello.jsx";
import { Anotacion } from "../expediente/Anotacion.jsx";

/** Pie: FranjaAliados + HiloTricolor + Sello chico + contacto mono + "¡Aguante la fotografía!" manuscrito. */
export function Pie({ aliados = [], contacto = [{ etiqueta: "Email:", valor: "[EMAIL DE CONTACTO]" }, { etiqueta: "Instagram:", valor: "[INSTAGRAM DEL PROYECTO]" }], cierre = "¡Aguante la fotografía!", cierreSrc, ciudad, fecha, mobile = false, style, className }) {
  const et = { fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: "var(--tipo-etiqueta)", margin: 0, lineHeight: 1.4 };
  const val = { fontFamily: "var(--fuente-mono)", fontSize: "var(--tipo-etiqueta)", margin: 0, lineHeight: 1.4, color: "var(--tinta-suave)", wordBreak: "break-word" };
  return (
    <footer className={className} style={{ display: "flex", flexDirection: "column", gap: "var(--espacio-6)", padding: mobile ? "var(--espacio-7) var(--margen-mobile)" : "var(--espacio-8) var(--margen-desktop)", ...style }}>
      {aliados.length > 0 && <FranjaAliados aliados={aliados} alto={32} />}
      <HiloTricolor />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--espacio-6)" }}>
        <Sello tamano={120} ciudad={ciudad} fecha={fecha} />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, minmax(160px, auto))", gap: "var(--espacio-5) var(--espacio-7)", flex: 1, minWidth: 220 }}>
          {contacto.map((c, i) => <div key={i}><p style={et}>{c.etiqueta}</p>{c.href ? <a href={c.href} style={{ ...val, color: "var(--azul-sello)" }}>{c.valor}</a> : <p style={val}>{c.valor}</p>}</div>)}
        </div>
        <Anotacion src={cierreSrc} alt={cierre} rotacion={-2} tamano="clamp(1.5rem, 3vw, 2.25rem)">{cierre}</Anotacion>
      </div>
    </footer>
  );
}
