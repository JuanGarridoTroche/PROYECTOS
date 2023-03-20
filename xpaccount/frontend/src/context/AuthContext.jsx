import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// Esta lógica de contexto nos permite envolver children (<App/>). Este contexto es una forma de mandar datos, funciones y valores entre componentes sin tener que pasar por todo el árbol de componentes.
export const AuthProvidercomponent = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [logged, setLogged] = useState(null);

  // Se ejecuta cuando carga el token y sacamos todos los datos del usuario que tiene dentro el token (id y role)
  useEffect(() => {
    const getUserData = async () => {
      try {
        
      } catch (error) {
        logout();
      }
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLogged(null);
  };

  return (
    <AuthContext.Provider value={{token, logged, setLogged, logout}}>
      {children}
    </AuthContext.Provider>
  )
};
