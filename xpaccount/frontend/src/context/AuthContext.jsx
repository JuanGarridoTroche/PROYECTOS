import { createContext, useEffect, useState } from "react";
import { getLoggedUserDataService } from "../services";

export const AuthContext = createContext();

// Esta lógica de contexto nos permite envolver children (<App/>). Este contexto es una forma de mandar datos, funciones y valores entre componentes sin tener que pasar por todo el árbol de componentes.
export const AuthProvidercomponent = ({ children }) => {
  const [tokenXpAccount, setTokenXpAccount] = useState(localStorage.getItem("tokenXpAccount"));
  const [logged, setLogged] = useState(null);

  // Se ejecuta cuando carga el token y sacamos todos los datos del usuario que tiene dentro el token (id y role)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getLoggedUserDataService({tokenXpAccount});
        setLogged(data);
      } catch (error) {
        logout();
      }
    };
    if(tokenXpAccount) getUserData();
  }, [tokenXpAccount]);

  const login = (tokenXpAccount)=> {
    console.log("token(login): ", tokenXpAccount);
    localStorage.setItem("tokenXpAccount", tokenXpAccount);
    setTokenXpAccount(tokenXpAccount);
    onsole.log("token(login): ", tokenXpAccount);
  }

  const logout = () => {
    localStorage.removeItem("tokenXpAccount");
    setTokenXpAccount(null);
    setLogged(null);
  };

  return (
    <AuthContext.Provider value={{tokenXpAccount, logged, setLogged, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
};
