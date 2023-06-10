import { createContext, useEffect, useState } from "react";
import { checkVotedNewsService, getloggedUserDataService } from "../services";

export const AuthContext = createContext();

// Esta lógica de contexto nos permite envolver children (<App/>). Este contexto es una forma de mandar datos, funciones y valores entre componentes sin tener que pasar por todo el árbol de componentes.
export const AuthProviderComponent = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggeduser, setLoggedUser] = useState(null);
  const [votedNews, setVotedNews] = useState(null);

  // Se ejecuta cuando carga el token y sacamos todos los datos del usuario que tiene dentro el token (id y role)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getloggedUserDataService({ token });
        setLoggedUser(data);
      } catch (error) {
        logout();
      }
    };
    if (token) getUserData();
  }, [token]);


  //Se ejecuta cuando carga el token y obtenemos todas las noticias votadas por nosotros
  useEffect(() => {
    const getVotedNews = async() => {   
      try {
        const votedNewsList = await checkVotedNewsService( {token});
        setVotedNews(votedNewsList);      
      } catch (error) {
               
      }      
   }
   if (token) getVotedNews();
  })

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedUser(null);
  };


  return (
    <AuthContext.Provider
      value={{ token, loggeduser, setLoggedUser, login, logout, votedNews }}
    >
      {children}
    </AuthContext.Provider>
  );
};
