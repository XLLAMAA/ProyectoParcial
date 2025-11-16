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
        <img className="ImgSerie" src={img} alt={title}/>    
        <h2 className="TituloSerie">{title}</h2>    
        <p className="LengSerie">{lang}</p>   
        <p className="RankingSerie">{rating}</p>    
        <div className="BotonesSerie">
          <button onClick={onOpen}>Detalles</button>
          <button onClick={onToggleFav}>{fav ? "★ Quitar" : "☆ Favoritos"}</button>
        </div>
      </div>
   );
}
