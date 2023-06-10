import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// El custom hook useEntries carga las entries de la API y nos retorna un objeto con las entries, loading y errorMessage
const useSearch = () => {
  const [news, setNews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();


  

  // El effect se ejecuta después del primer render
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Cuando empezamos a hacer el fetch, cambiamos el estado loading a true
        setLoading(true);

        // Hacemos el fetch y recogemos la respuesta del servidor
        const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news?${searchParams.toString()}`)

        // Nos traemos el body de la respuesta
        const json = await res.json();

        // Si la respuesta no viene bien, lanzamos un error con el mensaje que viene de la API
        if (!res.ok) {
          throw new Error(json.message);
        }

        // Cargamos los datos de las entries en el estado de entries
        setNews(json.data.entries);
      } catch (error) {
        // Si salta algún error, metemos el mensaje en el estado errorMessage
        setErrorMessage(error.message);
      } finally {
        // Al finalizar el fetch, cambiamos loading a false
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchParams]);

  return {
    news,
    errorMessage,
    loading,
    searchParams,
    setSearchParams,
  };
};

export default useSearch;
