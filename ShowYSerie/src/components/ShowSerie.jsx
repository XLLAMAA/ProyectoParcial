const getTitle = (show) => show?.name ?? "Sin título";
const getImg = (show) => show?.image?.medium || show?.image?.original || "";
const getLang = (show) => show?.language ?? "—";
const getRating = (show) => show?.rating?.average ?? "—";  

export default function ShowSerie({show, onOpen, onToggleFav, fav}) {
   const title = getTitle(show);
    const img = getImg(show);
    const lang = getLang(show);
    const rating = getRating(show);
     //Muestro la imagen
      //El titulo
       //El lenguaje
       //la puntuacion de la serie
    return (
        <div>
            <img src={img} alt={title}/>    
            <h2>{title}</h2>    
            <p>{lang}</p>   
            <p>{rating}</p>    
            <div>
                <button onClick={onOpen}>Detalles</button>
                <button onClick={onToggleFav}>{fav ? "★ Quitar" : "☆ Favoritos"}</button>
            </div>
        </div>
    );
}