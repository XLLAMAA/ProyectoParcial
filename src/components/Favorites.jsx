export default function Favorites({items, onOpen, onRemove}){
    
  if (!items || items.length === 0) {
      return (<p className="FError">Aun no hay favoritos</p>);
  }
  
  return (
      <div className="ListaFav">
          {items.map((f) => (
              <div key={f.id} className="ElementoFav">
                  {/*Agrgo boton de abrir la lista de favoritos*/}
                  {/*Muestro la imagen el nombre y la puntuacion de la serie guardada en favoritos*/}
                  <button className="BotonAbrirFav" onClick={() => onOpen(f.id)}>
                      {f.image ? <img className="FotoSerieFav" src={f.image} alt={f.name}/> : null}
                      <span className="NombreSerieFav">{f.name}</span>
                      {f.rating != null && <span className="RankingSerieFav">⭐ {f.rating}</span>}
                  </button>
                  {/*Agrego boton de quitar de favoritos*/}
                  <button className="EliminarDeFav" onClick={() => onRemove(f.id)}>Quitar</button>
              </div>
          ))}
      </div>
  );
}
