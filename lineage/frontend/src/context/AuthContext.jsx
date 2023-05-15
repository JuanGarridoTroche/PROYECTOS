import { createContext, useEffect, useState } from "react";
import { getLoggedUserDataService } from "../services";

export const Authcontext = createContext();

export const AuthProvidercomponent = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("tokenlng"));
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
    localStorage.setItem("tokenlng", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("tokenlng");
    setToken(null);
    setAuthorizedUser(null);
  };

  return (
    <Authcontext.Provider
      value={{ token, authorizedUser, setAuthorizedUser, login, logout }}
    >
      {children}
    </Authcontext.Provider>
  );
};
