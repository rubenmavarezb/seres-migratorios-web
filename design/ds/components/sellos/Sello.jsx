import React from "react";

const star = "0,-7 1.57,-2.16 6.66,-2.16 2.54,0.83 4.11,5.66 0,2.67 -4.11,5.66 -2.54,0.83 -6.66,-2.16 -1.57,-2.16";

/** Sello circular SVG en azul-sello: texto en arco, ciudad y fecha, tres estrellas, anillo doble, grano. */
export function Sello({ src, texto = "Seres Migratorios", ciudad = "Buenos Aires", fecha = "08 ago 2026", tamano = 200, rotacion = -12, color = "var(--azul-sello)", grano = true, style, className }) {
  if (src) return <img src={src} alt={`Sello ${texto}, ${ciudad}, ${fecha}`} className={className} data-rotacion style={{ display: "block", width: tamano, height: tamano, objectFit: "contain", transform: rotacion ? `rotate(${rotacion}deg)` : "none", flexShrink: 0, ...style }} />;
  const id = React.useId().replace(/:/g, "");
  const t = { fontFamily: "var(--fuente-mono)", fontWeight: 700, fill: color, textTransform: "uppercase" };
  return (
    <svg viewBox="0 0 190 190" width={tamano} height={tamano} className={[grano ? "sello-grano" : "", className].filter(Boolean).join(" ")} role="img" aria-label={`Sello ${texto}, ${ciudad}, ${fecha}`} data-rotacion style={{ transform: `rotate(${rotacion}deg)`, overflow: "visible", display: "block", flexShrink: 0, ...style }}>
      <defs><path id={`arco-${id}`} d="M 16,95 A 79,79 0 0 1 174,95" fill="none" /></defs>
      <circle cx="95" cy="95" r="88" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="95" cy="95" r="70" fill="none" stroke={color} strokeWidth="1.5" />
      <text style={t} fontSize="13" letterSpacing="3.2" textAnchor="middle"><textPath href={`#arco-${id}`} startOffset="50%">{texto.toUpperCase()}</textPath></text>
      <text style={t} x="95" y="90" fontSize="13" letterSpacing="1" textAnchor="middle">{ciudad.toUpperCase()}</text>
      <text style={t} x="95" y="112" fontSize="13" letterSpacing="1" textAnchor="middle">{fecha.toUpperCase()}</text>
      <g fill={color}>
        <polygon points={star} transform="translate(69,140)" /><polygon points={star} transform="translate(95,140)" /><polygon points={star} transform="translate(121,140)" />
      </g>
    </svg>
  );
}
