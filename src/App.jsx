// ─────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";          // useState: para manejar estados locales
import "./App.css";                        //Css
import SearchBar from "./components/SearchBar.jsx"; //Barra de busqueda de series 
import ShowSerie from "./components/ShowSerie.jsx"; //Tarjeta de cada serie
import Favorites from "./components/Favorites.jsx"; //Favoritos
import InfoSerie from "./components/InfoSerie.jsx"; //Info detallada de la serie

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: App
// ─────────────────────────────────────────────────────────────
export default function App() {
  // ───────────────────────────────────────────────────────────
  // ESTADOS MINIMOS
  // ───────────────────────────────────────────────────────────
  const [term, setTerm] = useState("");        //Lo que escribe el usuario en la barra de busqueda
  const [results, setResults] = useState([]);  //Lista de series encontradas
  const [loading, setLoading] = useState(false); //para desactivar el boton de busqueda mientras inicia la busqueda
  //Estado inicial de favoritos: lo leo directamente de localStorage una sola vez
  const [favorites, setFavorites] = useState(() => {
  try {
    const fav = localStorage.getItem("ListaFavs");
    return fav ? JSON.parse(fav) : [];
  } catch {
    return [];
  }
});


  // ───────────────────────────────────────────────────────────
  // ESTADOS PARA EL MODAL DE DETALLE
  // ───────────────────────────────────────────────────────────
  const [openShow, setOpenShow] = useState(null); //show basico que se ha abierto (o null si cerrado)
  const [detail, setDetail] = useState(null);     //detalle de /shows/{id}

  // ─────────────────────────────────────────────────────────────
  //Se guardan los cambios de favoritos si se hacen
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("ListaFavs", JSON.stringify(favorites));
  }, [favorites]);

  // ─────────────────────────────────────────────────────────────
  //Comprueba que tienes una serie en favoritos comparando los id
  // ─────────────────────────────────────────────────────────────
  const isFav = (id) => {
    return favorites.some((f) => f.id === id);
  };

  // ─────────────────────────────────────────────────────────────
  //Alterna una serie en favoritos: si ya estaba, la quita y si no estaba la agrega
  //prev: es la lista anterior de favoritos
  // ─────────────────────────────────────────────────────────────
  const toggleFav = (show) => {
    setFavorites((prev) => {
      //Compruebo si ya existe en favoritos
      const exists = prev.some((f) => f.id === show.id);
      if (exists) {
        //Si ya estaba, la elimino filtrando por id
        return prev.filter((f) => f.id !== show.id);
      }

      //Si no existe ya en la lista de favoritos, lo agregamos a la lista
      const compact = {
        id: show.id,
        name: show.name,
        image: show.image?.medium || show.image?.original || "",
        rating: show.rating?.average ?? null,
        language: show.language || "",
        genres: show.genres || [],
      };

      //Devolvemos la nueva lista de favoritos con la serie nueva al principio
      return [compact, ...prev];
    });
  };

  // ───────────────────────────────────────────────────────────
  // FUNCION: search
  // Hace la búsqueda a TVMaze y actualiza 'results'
  // ───────────────────────────────────────────────────────────
  const search = async () => {
    //Compruebo que haya texto que buscar en la barra de busqueda
    if (!term || !term.trim()) {
      return;
    }

    //Bloqueo el boton de buscar
    setLoading(true);

    try {
      //URL de la API de TVMaze
      const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
        term.trim()
      )}`;

      //Hago la peticion GET para obtener la respuesta de TVMaze
      const res = await fetch(url);

      //Si la respuesta no es 200-299, es por fallo
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      //Parseo la respuesta a JSON (deberia ser un array de objetos { score, show })
      const data = await res.json();

      //Me quedo solo con los objetos 'show'
      const shows = Array.isArray(data) ? data.map((item) => item.show) : [];

      //Guardo la lista de shows en el estado
      setResults(shows);
    } catch {
      //Si algo falla vacio los resultados
      setResults([]);
    } finally {
      //Actualizo el estado de carga
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // FUNCION: getShowDetails  (pide /shows/{id} para el modal)
  // ───────────────────────────────────────────────────────────
  const getShowDetails = async (id) => {
    setDetail(null);
    try {
      const url = `https://api.tvmaze.com/shows/${id}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail(null);
    }
  };

  // ───────────────────────────────────────────────────────────
  // FUNCION: abrir detalles desde los resultados
  // ───────────────────────────────────────────────────────────
  const handleOpenDetails = (show) => {
    //Guardo la serie seleccionada
    setOpenShow(show);
    //Pido el detalle de esa serie
    getShowDetails(show.id);
  };

  // ───────────────────────────────────────────────────────────
  // FUNCION: abrir detalles desde favoritos
  // ───────────────────────────────────────────────────────────
  const handleOpenFromFav = (id) => {
    //Busco primero si tengo la serie en los resultados
    let show = results.find((s) => s.id === id);

    //Si no esta en results, la construyo a partir del favorito
    if (!show) {
      const fav = favorites.find((f) => f.id === id);
      if (!fav) return;

      show = {
        id: fav.id,
        name: fav.name,
        image: fav.image ? { medium: fav.image } : null,
        rating: { average: fav.rating },
        language: fav.language,
        genres: fav.genres,
      };
    }

    //Abro el modal y cargo el detalle
    handleOpenDetails(show);
  };

  // ───────────────────────────────────────────────────────────
  // FUNCION: cerrar modal
  // ───────────────────────────────────────────────────────────
  const handleCloseModal = () => {
    setOpenShow(null);
    setDetail(null);
  };

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────
  return (
    <main className="app">
      
      <h1 className="tituloWeb">ShowYSerie</h1>
      {/*Barra de busqueda*/}
      <div className="barraBusqueda">
        <SearchBar
          value={term}
          onChange={setTerm}
          onSubmit={search}
          loading={loading}
        />
      </div>

      {/*Contenido principal: favoritos + resultados*/}
      <div className="layout">
        {/*Lista de favoritos*/}
        <aside className="favoritosList">
          <h2 className="NameListFav">Tus Favoritos</h2>
          <Favorites
            items={favorites}
            //Abrir modal desde un favorito
            onOpen={handleOpenFromFav}
            //Quitar de favoritos
            onRemove={(id) =>
              setFavorites((prev) => prev.filter((f) => f.id !== id))
            }
          />
        </aside>

        {/*Resultados de la busqueda*/}
        <section className="Resultados">
          {/*Lista de series encontradas*/}
          <div className="SeriesList">
            {results.map((show) => (
              <ShowSerie
                key={show.id}
                show={show}
                onOpen={() => handleOpenDetails(show)}
                onToggleFav={() => toggleFav(show)}
                fav={isFav(show.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/*Modal de detalles*/}
      <InfoSerie
        open={!!openShow}
        onClose={handleCloseModal}
        show={openShow}
        detail={detail}
      />
      <p className="firma">Hecho por Jaime Adánez</p>
    </main>
  );
}