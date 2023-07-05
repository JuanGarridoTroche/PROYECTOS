import { useEffect, useState, createContext } from "react";
import { getFamilyNameAndPdfsService, getLoggedUserDataService } from "../services";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProviderComponent = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem("tokenSeco"));
  const [logged, setLogged] = useState(null);
  const [families, setFamilies] = useState([]);

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
    // console.log("LOGOUT");
  }; 

  const getFamilyNames = async ()=> {
    const familyNames = await getFamilyNameAndPdfsService(token, logged?.url);
    setFamilies(familyNames.pop());
    // console.log(families);
  }

  return (
    <AuthContext.Provider value={{token, logged, setLogged, login, logout, families}}>
      {children}
    </AuthContext.Provider>
  )
 
}

AuthProviderComponent.propTypes = {
  children: PropTypes.any,
}