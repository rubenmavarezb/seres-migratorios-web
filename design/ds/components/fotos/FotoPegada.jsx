import React from "react";

/** Foto pegada: borde papel-puro, sombra única, rotación leve. Variantes recortada y sangrada. */
export function FotoPegada({ src, alt = "", variante = "pegada", rotacion = 0, ancho, alto, pie, credito, posicion = "50% 50%", borde = "var(--foto-borde)", style, className }) {
  const img = <img src={src} alt={alt} style={{ display: "block", width: "100%", height: alto ? "100%" : "auto", objectFit: "cover", objectPosition: posicion }} />;
  const rot = rotacion && variante !== "sangrada" ? `rotate(${rotacion}deg)` : "none";
  const base = { display: "inline-block", boxSizing: "border-box", width: ancho, height: alto, transform: rot, ...style };
  if (variante === "sangrada") return <div className={className} style={{ ...base, overflow: "hidden" }}>{img}</div>;
  const figura = variante === "recortada" ? base : { ...base, background: "var(--papel-puro)", padding: borde, boxShadow: "var(--sombra-foto)" };
  return (
    <figure className={className} data-rotacion style={{ margin: 0, ...figura }}>
      <div style={{ height: alto ? `calc(100% - 2 * ${variante === "recortada" ? "0px" : borde})` : "auto", overflow: "hidden" }}>{img}</div>
      {(pie || credito) && (
        <figcaption style={{ fontFamily: "var(--fuente-mono)", fontSize: "var(--tipo-metadatos)", color: "var(--grafito)", paddingTop: "var(--espacio-2)", lineHeight: 1.4 }}>
          {pie}{pie && credito ? " · " : ""}{credito}
        </figcaption>
      )}
    </figure>
  );
}
