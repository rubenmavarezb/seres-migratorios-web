import React from "react";
import { Anotacion } from "../expediente/Anotacion.jsx";

/** Ficha de fotógrafo: "001 NOMBRE", foto principal, retrato chico superpuesto, frase manuscrita, firma, Instagram. */
export function FichaFotografo({ numero, nombre = "[NOMBRE]", foto, fotoAlt = "", retrato, retratoAlt, fraseManuscrita, frase, firma, instagram, href, ancho = 420, altoFoto, retratoTamano = [120, 150], style, className }) {
  const enc = { fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: "var(--tipo-etiqueta)", color: "var(--tinta)", margin: 0 };
  const rw = Array.isArray(retratoTamano) ? retratoTamano[0] : retratoTamano, rh = Array.isArray(retratoTamano) ? retratoTamano[1] : retratoTamano * 1.25;
  return (
    <article className={className} style={{ width: ancho, maxWidth: "100%", display: "flex", flexDirection: "column", gap: "var(--espacio-3)", fontFamily: "var(--fuente-mono)", ...style }}>
      <h3 style={enc}>{numero ? `${numero} ` : ""}{href ? <a href={href} style={{ color: "inherit", textDecoration: "none" }}>{nombre}</a> : nombre}</h3>
      <div style={{ position: "relative", paddingLeft: retrato ? rw * 0.35 : 0, paddingBottom: retrato ? rh * 0.45 : 0 }}>
        {foto ? <img src={foto} alt={fotoAlt} style={{ display: "block", width: "100%", height: altoFoto || "auto", objectFit: "cover" }} /> : <div style={{ aspectRatio: "3 / 2", background: "var(--azul-tinta-agua)", display: "grid", placeItems: "center", fontSize: 12, textTransform: "uppercase", color: "var(--azul-profundo)" }}>[FOTO PRINCIPAL]</div>}
        {retrato && <img src={retrato} alt={retratoAlt || `Retrato de ${nombre}`} style={{ position: "absolute", left: 0, bottom: 0, width: rw, height: rh, objectFit: "cover", display: "block" }} />}
      </div>
      {(fraseManuscrita || frase) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--espacio-2)" }}>
          {fraseManuscrita
            ? <Anotacion src={fraseManuscrita} alt={frase || ""} rotacion={-1} ancho="100%" />
            : <Anotacion rotacion={-1} tamano="1.375rem">{frase}</Anotacion>}
          {firma && <img src={firma} alt={`Firma de ${nombre}`} style={{ alignSelf: "flex-end", height: 40, width: "auto" }} />}
        </div>
      )}
      {instagram && <a href={`https://instagram.com/${instagram.replace("@", "")}`} style={{ fontFamily: "var(--fuente-mono)", fontWeight: 700, fontSize: "var(--tipo-metadatos)", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", color: "var(--azul-sello)", textUnderlineOffset: 3 }}>{instagram}</a>}
    </article>
  );
}
