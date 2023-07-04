import ("../css/Main.css");
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUserService } from "../services";
import { AuthContext } from "../context/AuthContext";


export const Login = ()=> {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {token, login, logged} = useContext(AuthContext);    

  useEffect(()=> {
    const checkingToken = async ()=> {
      try {
        // Comprobamos que esté logueado            
        if(!token) {
          navigate("/")          
        }
        
        if(logged?.url) navigate(`/familia/${logged?.url}`);       
      } catch (error) {
        alert(error.message);
      }
    }    
    if (token) checkingToken();
  }, [token, navigate, logged?.url]);


  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");    
    try {      
      const loggedUser = await loginUserService(password);   
      // console.log(loggedUser.data);
      // console.log(loggedUser.token);
      if(loggedUser.data.length < 1){              
        throw new Error("Contraseña incorrecta");
      }

      login(loggedUser?.token);

      console.log("Bienvenido a la familia " + loggedUser?.data?.lineage + " /" + loggedUser?.data?.url);
      navigate(`/familia/${loggedUser?.data?.url}`);
      // navigate(<Family/>);   
    } catch (err) {
      setError(err.message);
    }
  }
  return(
    <>
      <h1 className="main__title">Familia Seco</h1>
      {error ? <p className="main__error">{error}</p> : null}
      <form onSubmit={handleSubmit} action="#" method="get" className="main__form"> 
      <label htmlFor="pass" className="main__pass--label">Escribe tu contraseña </label>
        <input type="password" id="pass" className="main__pass main__input" placeholder="Introduzca su contraseña" autoComplete="on" onChange={(e)=> {setError(""); setPassword(e.target.value)}}/>
        <button className="main__button">Enviar</button>
      </form>
    </>
  )
}