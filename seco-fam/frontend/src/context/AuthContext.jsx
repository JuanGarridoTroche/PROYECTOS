import { useEffect, useState, createContext } from "react";
import { getLoggedUserDataService } from "../services";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProviderComponent = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem("tokenSeco"));
  const [logged, setLogged] = useState(null);

  useEffect(()=> {
    const getUserData = async() => {
      try {
        const data = await getLoggedUserDataService(token);
        setLogged(data);
      } catch (err) {
        logout();
      }
    }
    if(token) getUserData();
  }, [token]);

  const login = (token)=> {
    // console.log(token);
    localStorage.setItem("tokenSeco", token);
    setToken(token);
  }
  
  const logout = () => {
    localStorage.removeItem("tokenSeco");
    setToken(null);
    setLogged(null);
    console.log("LOGOUT");
  }; 

  return (
    <AuthContext.Provider value={{token, logged, setLogged, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
 
}

AuthProviderComponent.propTypes = {
  children: PropTypes.any,
}