import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getAllFamiliyNamesService, getLoggedUserDataService } from "../services";


// Creamos el contexto
export const AuthContext = createContext();

// Creamos las funciones que nos van a dar unos resultados a los cuales vamos a tener acceso en toda la web
export const AuthContextProvider = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem("token4Fam"));
  const [user, setUser] = useState(null);
  const [familyNames, setFamilyNames] = useState([]);
  const [error, setError] = useState("");

  useEffect(()=>{
    const getUserDataFromToken = async()=> {
      try {
        // Extraer datos del usuario logueado a través de su token
        const userData = await getLoggedUserDataService(token);
        setUser(userData)
      } catch (err) {
        setError(err.message);
      }
    }
    if(token)  getUserDataFromToken();
  }, [token])

  const login = (token) => {
    localStorage.setItem("token4Fam", token);
    setToken(token);
  }

  const logout = ()=> {
    localStorage.removeItem("token4Fam");
    setToken(null);
    setUser(null);
  }

  const getFamilyNames = async()=> {
    try {
      // Devuelve los nombres de todas las familias si eres admin
      const allFamilyNames = await getAllFamiliyNamesService(token);
      setFamilyNames(allFamilyNames);      
    } catch (err) {
      setError(err.message);
    }
  }

  console.log("Token: ", token);
  console.log("Error: ", error);
  return (
    <AuthContext.Provider value={{token, user, login, logout, getFamilyNames, familyNames}}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
}