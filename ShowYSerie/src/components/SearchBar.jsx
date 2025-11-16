export default function SearchBar({value, onChange, onSubmit, loading}) {

  const handleSubmit = (e) => {
      //evita recarga de pagina
      e.preventDefault();
      //Si esta vacia la barra de busqueda no busca nada
      if (!value || !value.trim()) { 
          return;
      }
      //Aviso para que se haga la busquedas
      onSubmit(); 
  }

  return (
    <form onSubmit={handleSubmit}>
      <input className="barraBusquedaInput"
        type="text" 
        placeholder="Buscar una serie"
        //texto que muestra el input
        value={value}
        //Cada tecla avisa al padre (app) para actualizar el valor (value)
        onChange={(e) => onChange(e.target.value)}  
      />
      <button className="barraBusquedaButton" type="submit" disabled={loading}>🔍</button>
    </form>
  );
}
