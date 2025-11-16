export default function InfoSerie({ open, onClose, show, detail }) {
  if (!open) {
    return null;
  }

  const img =
    detail?.image?.original ||
    show?.image?.original ||
    show?.image?.medium ||
    "";

  //Datos de la serie a mostrar en el modal
  const summary = detail?.summary || show?.summary || "<p>No hay descripción disponible.</p>";
  const language = detail?.language || show?.language || "—";
  const rating = detail?.rating?.average ?? show?.rating?.average ?? "N/A";
  const genres = (detail?.genres || show?.genres || []).join(", ");

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

          <p className="lenguajeModal">
            Idioma: {language}
          </p>

          {/* Descripcion de la serie, uso dangerouslySetInnerHTML para que muestre como descripcion justo lo que pone en la serie TVMaze */}
          <div className="descripcionModal" dangerouslySetInnerHTML={{ __html: summary }}></div>

        </div>
      </article>
    </div>
  );
}
