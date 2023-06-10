import { useEffect, useState } from "react"
import { searchingNewsService } from "../services";

export const Search = ({search})=> {
  const [news, setNews] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(()=> {
  
    try {
      const data = searchingNewsService({search});   

      if(data.length < 1) {
        setError(`No existe ninguna noticia con la búsqueda "${search}".`)
      }
      setNews(data); 

      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [search])

  return {news}
}