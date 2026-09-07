import React from "react";
import { CajaNombre } from "../expediente/CajaNombre.jsx";

const defaultLinks = [
  { etiqueta: "Manifiesto", href: "#manifiesto" }, { etiqueta: "Fotógrafos", href: "#fotografos" }, { etiqueta: "Ediciones", href: "#ediciones" },
  { etiqueta: "Convocatoria", href: "#convocatoria" }, { etiqueta: "Apoyar", href: "#apoyar" },
];

/** Barra estilo ficha: marca en display-md, links mono 700 mayúsculas, selector ES / EN. Mobile: menú a pantalla completa. */
export function Nav({ marca = "Seres Migratorios", hrefMarca = "#", links = defaultLinks, activo, idioma = "ES", idiomas = ["ES", "EN"], onIdioma, onNavegar, mobile = false, style, className }) {
  const [abierto, setAbierto] = React.useState(false);
  const link = (l, grande) => {
    const act = activo === l.etiqueta || activo === l.href;
    return (
      <a key={l.etiqueta} href={l.href} onClick={(e) => { if (onNavegar) { e.preventDefault(); onNavegar(l); } setAbierto(false); }}
        style={grande
          ? { fontFamily: "var(--fuente-display)", textTransform: "uppercase", fontSize: "var(--tipo-display-lg)", lineHeight: 0.9, color: act ? "var(--azul-sello)" : "var(--tinta)", textDecoration: "none" }
          : { fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: "var(--tipo-etiqueta)", color: act ? "var(--azul-sello)" : "var(--tinta)", textDecoration: act ? "underline" : "none", textUnderlineOffset: 4, textDecorationThickness: 2, padding: "12px 0", display: "inline-block" }}>
        {l.etiqueta}
      </a>
    );
  };
  const selector = (
    <div style={{ display: "flex", gap: 4 }} role="group" aria-label="Idioma">
      {idiomas.map((i) => <CajaNombre key={i} chica activo={i === idioma} onClick={() => onIdioma && onIdioma(i)} aria-pressed={i === idioma}>{i}</CajaNombre>)}
    </div>
  );
  return (
    <header className={className} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--espacio-5)", padding: mobile ? "12px var(--margen-mobile)" : "16px var(--margen-desktop)", borderBottom: "1px solid var(--linea)", background: "var(--papel)", position: "relative", zIndex: "var(--z-flotante)", ...style }}>
      <a href={hrefMarca} style={{ fontFamily: "var(--fuente-display)", textTransform: "uppercase", lineHeight: 0.85, letterSpacing: "-0.01em", fontSize: mobile ? "1.75rem" : "var(--tipo-display-md)", color: "var(--tinta)", textDecoration: "none", whiteSpace: "nowrap" }}>{marca}</a>
      {mobile ? (
        <button onClick={() => setAbierto(true)} aria-expanded={abierto} aria-label="Abrir menú" style={{ fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.75rem", border: "2px solid var(--tinta)", background: "var(--papel-puro)", padding: "6px 12px", minHeight: 44, cursor: "pointer", borderRadius: 0 }}>Menú</button>
      ) : (
        <nav style={{ display: "flex", alignItems: "center", gap: "var(--espacio-6)" }}>
          <div style={{ display: "flex", gap: "var(--espacio-5)", flexWrap: "wrap" }}>{links.map((l) => link(l, false))}</div>
          {selector}
        </nav>
      )}
      {mobile && abierto && (
        <div role="dialog" aria-modal="true" className="papel" style={{ position: "absolute", inset: 0, height: "100vh", minHeight: 600, zIndex: "var(--z-modal)", padding: "var(--margen-mobile)", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "var(--espacio-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {selector}
            <button onClick={() => setAbierto(false)} aria-label="Cerrar menú" style={{ fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.75rem", border: "2px solid var(--tinta)", background: "var(--tinta)", color: "var(--papel)", padding: "6px 12px", minHeight: 44, cursor: "pointer", borderRadius: 0 }}>Cerrar</button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "var(--espacio-4)" }}>{links.map((l) => link(l, true))}</nav>
        </div>
      )}
    </header>
  );
}
