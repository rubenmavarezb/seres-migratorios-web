import React from "react";

/** Campo de formulario de papel: etiqueta mono 700 arriba, input con borde inferior 2 px. */
export function Campo({ etiqueta, nombre, tipo = "text", valor, onChange, placeholder, opciones = [], error, ayuda, requerido = false, filas = 4, deshabilitado = false, style, className }) {
  const [foco, setFoco] = React.useState(false);
  const id = nombre || React.useId();
  const borde = error ? "var(--color-error)" : foco ? "var(--azul-sello)" : "var(--tinta)";
  const lab = { fontFamily: "var(--fuente-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tipo-etiqueta-letter-spacing)", fontSize: "var(--tipo-etiqueta)", color: error ? "var(--color-error)" : "var(--tinta)", display: "block" };
  const inp = { fontFamily: "var(--fuente-mono)", fontWeight: 400, fontSize: "var(--tipo-cuerpo)", lineHeight: 1.4, color: "var(--tinta)", background: "transparent", border: 0, borderBottom: `2px solid ${borde}`, borderRadius: 0, padding: "10px 0", width: "100%", boxSizing: "border-box", outline: "none", minHeight: tipo === "textarea" ? undefined : "var(--altura-interactiva)", appearance: "none", resize: "vertical", opacity: deshabilitado ? 0.6 : 1 };
  const common = { id, name: nombre, value: valor, onChange, placeholder, required: requerido, disabled: deshabilitado, onFocus: () => setFoco(true), onBlur: () => setFoco(false), "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined };
  const msg = (t, c, k) => <span id={`${id}-${k}`} style={{ fontFamily: "var(--fuente-mono)", fontSize: "var(--tipo-metadatos)", color: c, display: "block", lineHeight: 1.4 }}>{t}</span>;

  if (tipo === "checkbox") {
    return (
      <label className={className} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", fontFamily: "var(--fuente-mono)", fontSize: "var(--tipo-metadatos)", lineHeight: 1.5, color: "var(--tinta)", ...style }}>
        <input type="checkbox" id={id} name={nombre} checked={!!valor} onChange={onChange} required={requerido} disabled={deshabilitado} onFocus={() => setFoco(true)} onBlur={() => setFoco(false)} style={{ appearance: "none", width: 20, height: 20, minWidth: 20, margin: 2, border: `2px solid ${borde}`, borderRadius: 0, background: valor ? "var(--tinta)" : "var(--papel-puro)", boxShadow: valor ? "inset 0 0 0 3px var(--papel-puro)" : "none", cursor: "pointer" }} />
        <span>{etiqueta}{requerido && " *"}{error && msg(error, "var(--color-error)", "error")}</span>
      </label>
    );
  }
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <label htmlFor={id} style={lab}>{etiqueta}{requerido && " *"}</label>
      {tipo === "textarea" ? <textarea rows={filas} style={inp} {...common} />
        : tipo === "select" ? (
          <div style={{ position: "relative" }}>
            <select style={{ ...inp, paddingRight: 28, cursor: "pointer" }} {...common}>
              {placeholder && <option value="">{placeholder}</option>}
              {opciones.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}
            </select>
            <span aria-hidden="true" style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-60%)", fontFamily: "var(--fuente-mono)", fontWeight: 700, pointerEvents: "none" }}>v</span>
          </div>
        ) : <input type={tipo} style={inp} {...common} />}
      {error ? msg(error, "var(--color-error)", "error") : ayuda ? msg(ayuda, "var(--grafito)", "ayuda") : null}
    </div>
  );
}
