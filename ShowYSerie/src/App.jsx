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
  const [term, setTerm] = useState("");     //Lo que escrribe cada usuario en la barra de busqueda
  const [results, setResults] = useState([]); //Resultado de la busuqeda
  const [loading, setLoading] = useState(false); //para desactivar el boton de busqueda mientas incia la busqueda
  const [favorites, setFavorites] = useState([]); //lista de favoritos

  // ───────────────────────────────────────────────────────────
  // ESTADOS PARA EL MODAL DE DETALLE
  // ───────────────────────────────────────────────────────────
  const [openShow, setOpenShow] = useState(null); //show básico que se ha abierto (o null si cerrado)
  const [detail, setDetail] = useState(null);     //detalle de /shows/{id}

  // ─────────────────────────────────────────────────────────────
  //Cargar al abrir la web la lista de favs con sus contenidos
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fav = localStorage.getItem("ListaFavs");
    if (fav) {
      setFavorites(JSON.parse(fav));
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  //Se guardan los cambios si se hacen
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("ListaFavs", JSON.stringify(favorites));
  }, [favorites]);

  // ─────────────────────────────────────────────────────────────
  //Comprueba que tienes una serie comparano los id, por que some devuleve true si encuentra alguna que cumpla la condicion, con la condicion de f.id === id
  // ─────────────────────────────────────────────────────────────
  const isFav = (id) => {
    return favorites.some((f) => f.id === id);
  };

  // ─────────────────────────────────────────────────────────────
  //Alterna una serie en favoritos: Si ya estaba, lo quita y si no estaba lo agrega
  //prev: es una variable que uso para hacer referencia a la serie mas reciente de favoritos
  // ─────────────────────────────────────────────────────────────
  const toggleFav = (show) => {
    setFavorites((prev) => {
      //Si lo eliminmos de la lista, busca la serie por su id y lo eliina de la lista de favoritos
      const exists = prev.some((f) => f.id === show.id);
      if (exists) {
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

      //Devolvemos la nueva lista de favoritos con o sin la nueva/vieja serie
      return [compact, ...prev];
    });
  };

  // ───────────────────────────────────────────────────────────
  // FUNCIÓN: search
  //   - Se ejecuta cuando SearchBar llama a onSubmit()
  //   - Pide datos a la API de TVMaze con el término que hay en 'term'
  //   - Guarda el array recibido en 'results'
  //   - SIN mensajes de estado: si falla, dejamos results vacío
  // ───────────────────────────────────────────────────────────
  const search = async () => {
    //Compruebo que haya texto que buscar en la barra de busqueda
    if (!term || !term.trim()) {
      return;
    }

    //Bloqueo el boton de buscar
    setLoading(true);

    try {
      //El featch de la TVMaze
      const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
        term.trim()
      )}`;

      // Hacemos la petición GET
      const res = await fetch(url);

      // Si la respuesta no es 200-299, consideramos que falló
      if (!res.ok) throw new Error("HTTP " + res.status);

      // Parseamos la respuesta a JSON (debería ser un array de objetos { score, show })
      const data = await res.json();

      // Guardamos la lista de resultados (si no es array por lo que sea, dejamos [])
      setResults(Array.isArray(data) ? data : []);
    } catch {
      // Si algo falla, no mostramos mensajes: simplemente vaciamos resultados
      setResults([]);
    } finally {
      // Quitamos el "cargando" siempre al terminar
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // FUNCIÓN: getShowDetails  (pide /shows/{id} para el modal)
  // ───────────────────────────────────────────────────────────
  const getShowDetails = async (id) => {
    setDetail(null);
    try {
      const url = `https://api.tvmaze.com/shows/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail(null);
    }
  };

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────
  return (
    // main.app -> clase para el contenedor (está en App.css)
    <main className="app">
      {/* Título de la página */}
      <h1 className="app__title">Buscador de series</h1>

      {/* Barra de búsqueda SIEMPRE ARRIBA y centrada */}
      <div className="sticky-wrap">
        {/* SearchBar:
            - value: el texto actual del input (estado 'term')
            - onChange: actualiza 'term' cada vez que escribes
            - onSubmit: cuando envías (Enter o botón), se ejecuta 'search'
            - loading: desactiva el botón mientras estamos buscando */}
        <SearchBar
          value={term}
          onChange={setTerm}
          onSubmit={search}
          loading={loading}
        />
      </div>

      {/* === CONTENIDO: FAVORITOS IZQUIERDA | RESULTADOS DERECHA === */}
      <div className="layout">
        {/*Lista de favoritos*/}
        <aside className="favoritosList">
          <h2 className="NameListFav">Tus Favoritos</h2>
          <Favorites
            items={favorites}
            onOpen={(id) => {}}
            onRemove={(id) =>
              setFavorites((prev) => prev.filter((f) => f.id !== id))
            }
          />
        </aside>

        {/* MOSTRAMOS EL PANEL SI HAY RESULTADOS O ESTAMOS BUSCANDO */}
        {(results.length > 0 || loading) && (
          <section className="results-panel">
            {loading && <p className="no-results">Buscando "{term}"…</p>}

            {!loading && results.length === 0 && term.trim() !== "" && (
              <p className="no-results">
                No se encontraron resultados para «{term}»
              </p>
            )}

            {results.length > 0 && (
              <div className="grid">
                {results.map((item) => {
                  const show = item.show; // Extraemos el objeto 'show' del resultado
                  if (!show) return null; // Seguridad por si viniera raro

                  return (
                    <ShowSerie
                      key={show.id} // key única por elemento (id de la serie)
                      show={show} // datos de la serie (nombre, imagen, idioma, rating…)
                      onOpen={() => {
                        //Abrir modal y pedir detalle
                        setOpenShow(show);
                        getShowDetails(show.id);
                      }}
                      onToggleFav={() => toggleFav(show)}
                      fav={isFav(show.id)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modal de detalle (InfoSerie) */}
      <InfoSerie
        open={!!openShow}
        onClose={() => setOpenShow(null)}
        show={openShow}
        detail={detail}
      />
    </main>
  );
}
