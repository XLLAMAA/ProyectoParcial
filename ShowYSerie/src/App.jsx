// src/App.jsx
// ─────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────
import { useState } from "react";          // useState: para manejar estados locales
import "./App.css";                        // Importo tus estilos separados (App.css)
import SearchBar from "./components/SearchBar.jsx"; // Tu barra de búsqueda (input + botón)
import ShowSerie from "./components/ShowSerie.jsx"; // Tu tarjeta para pintar cada serie


// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: App
// ─────────────────────────────────────────────────────────────
export default function App() {
  // ───────────────────────────────────────────────────────────
  // ESTADOS MÍNIMOS
  // ───────────────────────────────────────────────────────────
  const [term, setTerm] = useState("");     // term: texto que escribe el usuario en la barra
  const [results, setResults] = useState([]); // results: array que viene de la API (búsqueda)
  const [loading, setLoading] = useState(false); // loading: para desactivar el botón mientras busca

  // ───────────────────────────────────────────────────────────
  // FUNCIÓN: search
  //   - Se ejecuta cuando SearchBar llama a onSubmit()
  //   - Pide datos a la API de TVMaze con el término que hay en 'term'
  //   - Guarda el array recibido en 'results'
  //   - SIN mensajes de estado: si falla, dejamos results vacío
  // ───────────────────────────────────────────────────────────
  const search = async () => {
    // Si no hay texto (o solo espacios), no hacemos nada
    if (!term || !term.trim()) return;

    // Marcamos "cargando" para bloquear el botón de búsqueda
    setLoading(true);

    try {
      // Construimos la URL de búsqueda de TVMaze con el término
      const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term.trim())}`;

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
  // RENDER
  // ───────────────────────────────────────────────────────────
  return (
    // main.app -> clase para el contenedor (está en App.css)
    <main className="app">
      {/* Título de la página */}
      <h1 className="app__title">Buscador de series</h1>

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

      {/* Grid de resultados:
          - Recorremos 'results' con .map
          - Cada item tiene la forma { score, show }
          - Extraemos 'show' y se lo pasamos a ShowSerie */}
      <section className="grid">
        {results.map((item) => {
          const show = item.show;   // Extraemos el objeto 'show' del resultado
          if (!show) return null;   // Seguridad: si por algún motivo no hay show, no pintamos

          return (
            <ShowSerie
              key={show.id}         // key única por elemento (id de la serie)
              show={show}           // datos de la serie (nombre, imagen, idioma, rating…)
              onOpen={() => {
                // Más adelante podrás abrir un modal aquí
                // De momento, lo dejamos como "placeholder" simple (nada de mensajes)
                // console.log("Detalles:", show?.name);
              }}
              onToggleFav={() => {
                // Placeholder de favoritos (implementaremos más tarde)
                // console.log("Favorito:", show?.id, show?.name);
              }}
              fav={false}           // Por ahora, no hay favoritos reales (siempre false)
            />
          );
        })}   
      </section>  
    </main>   
  );  
}
