import { useEffect, useState } from "react";
import { loadNewsService } from "../services";

const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  


// Se carga solo la primera vez. Función asíncrona ya que solictamos datos a elementos externos como nuestro backend
  useEffect(() => {
    const loadNews = async () => {
      try {        
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
  }, [news]);

 const addNews = (singleNews) => {
  setNews([singleNews, ...news])
 }

 const removeNews = (id) => {
  setNews(news.filter((singleNews) => singleNews.id !== id));
 }

  return {news, loading, error, addNews, removeNews};
};

export default useNews;
