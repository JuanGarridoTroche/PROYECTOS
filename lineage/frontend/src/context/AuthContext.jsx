import { createContext, useEffect, useState } from "react";
import { getLoggedUserDataService } from "../services";

export const AuthContext = createContext();

export const AuthProvidercomponent = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("tokenLng"));
  const [authorizedUser, setAuthorizedUser] = useState(null);

  //useEffect que se ejecuta cuando se carga por primera vez y cada vez que se modifique el token
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getLoggedUserDataService(token);
        console.log(data);
        setAuthorizedUser(data);
      } catch (err) {}
    };
    if (token) getUserData();
  }, [token]);

  const login = (token) => {
    localStorage.setItem("tokenLng", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("tokenLng");
    setToken(null);
    setAuthorizedUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, authorizedUser, setAuthorizedUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
