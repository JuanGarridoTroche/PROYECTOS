import { useEffect, useState } from "react"
import { loadNewsByCategoryService } from "../services";

export const NewsByCategory_BORRAR = ({children: category})=> {
  const [newsByCat, setNewsByCat] = useState([]);
  const [loading, setLoading] =useState(true);
  const [error, setError] =useState('');
  

  useEffect(()=> {
    const loadNewsByCategory = async () => {
      try {
        const data = await loadNewsByCategoryService(category);
        setNewsByCat(data);
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadNewsByCategory();
  }, [category]);


  return {newsByCat, loading, error}
}