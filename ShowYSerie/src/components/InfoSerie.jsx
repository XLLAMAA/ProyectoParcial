export default function InfoSerie({ open, onClose, show, detail }) {
  if (!open) return null;

  const img =
    detail?.image?.original ||
    show?.image?.original ||
    show?.image?.medium ||
    "";

  // Cierro al clicar fuera del modal
  const cerrarClickFondo = (e) => {
    e.stopPropagation();
    onClose();
  };

  // Evito cierre al clicar dentro del modal
  const stop = (e) => e.stopPropagation();

  return (
    <div className="fondoModal" onClick={cerrarClickFondo}>
      <article className="cartaModal" onClick={stop}>
        <button className="cerrarModal" onClick={onClose} aria-label="Cerrar">X</button>

        {/* Muestra la imagen de la serie y sino la muestra en blanco */}
        {img ? (
            <img className="imagenModal" src={img} alt={show?.name} />
             ) : (
             <div className="imagenModal" style={{ background: "#e5e7eb" }} />
        )}

        <div className="contenidoModal">
          <h3 className="tituloModal">{detail?.name || show?.name}</h3>

          <p className="ratingModal">
            Rating: {detail?.rating?.average ?? show?.rating?.average ?? "N/A"}
          </p>

          <p className="generoModal">
            {(detail?.genres || show?.genres || []).join(", ")}
          </p>

        </div>
      </article>
    </div>
  );
}
