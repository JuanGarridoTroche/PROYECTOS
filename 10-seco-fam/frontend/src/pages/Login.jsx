import ("../css/Login.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export const Login =()=> {
  const {token, user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(()=> {
    const checkingToken = async()=> {
      console.log("--Login: checking token: " + token + "--");
      try {
        if(user.url) navigate(`/familia/${user.url}`);
      } catch (err) {
        setError(err.message);
      }
    }
    // Si está logueado hace el useEffect
    if(!token) checkingToken();
  }, [token, navigate, user])

  return (
    <section className="login">
      <h1 className="login__title"><span>4</span> Fam</h1>
      <form className="login__form"> 
        {error ? <p className="error">{error}</p> : null}
        <label htmlFor="pass" className="login__label">Escribe tu contraseña </label>
        <input type="password" id="pass" className="login__pass login__input" placeholder="Introduzca su contraseña" autoComplete="on"/>
        <button className="login__button">Enviar</button>
      </form>
    </section>

  )
}