import { useEffect, useState } from "react";
import { loadNewsService } from "../services";

const useNews_BORRAR = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


// Se carga solo la primera vez. Función asíncrona ya que solictamos datos a elementos externos como nuestro backend
  useEffect(() => {
    const loadNews = async () => {
      try {
        // FIXME: Habría que solicitar las noticias de la más actual a la más antigua (crear el endpoint en el backend)
        // Nos conectamos al backend y solicitamos las noticias ordenadas de mejor a peor feedback (/news/top)
        const data = await loadNewsService();
        setNews(data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  return {news, loading, error};
};

export default useNews_BORRAR;
