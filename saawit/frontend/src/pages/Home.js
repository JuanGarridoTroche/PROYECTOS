import { useContext } from "react";
import { NewsList } from "../components/NewsList";
import { ErrorMessage } from "../components/ErrorMessage";
import { CreateNews } from "../components/CreateNews";
import { AuthContext } from "../context/AuthContext";
import  useNews  from "../hooks/useNews";


export const Home = () => {
  
  const { news, loading, error, addNews, removeNews } = useNews();  
  const {user} = useContext(AuthContext);
  

  if (loading) return <p>Cargando noticias...</p>;
  if (error) return <ErrorMessage message={error}/>;

  return (      
    <>
      {user ? <CreateNews addNews={addNews}/> : null}       
      <NewsList news={news} removeNews={removeNews}/>    
    </>
  );
};
