import ("../css/Login.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUserService } from "../services";


export const Login =()=> {
  const {token, user, login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=> {
    const checkingToken = async()=> {
      // console.log("Login: checking token: " + token);
      try {
        if(user.url) navigate(`/familia/${user.url}`);
      } catch (err) {
        setError(err.message);
      }
    }
    // Si está logueado haz el useEffect
    if(token) checkingToken();
  }, [token, navigate, user])

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");
    try {
      const loggedUser = await loginUserService(password);
      if(loggedUser.data.length < 1) {
        throw new Error("Contraseña incorrecta");
      }
      login(loggedUser.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="login">
      <h1 className="login__title">Á<span>r</span>bore Fa<span>m</span>iliar</h1>
      <form className="login__form" onSubmit={handleSubmit}> 
        {error ? <p className="error">{error}</p> : null}
        <label htmlFor="pass" className="login__label">Escribe tu contraseña </label>
        <input type="password" id="pass" className="login__pass login__input" placeholder="Introduzca su contraseña" autoComplete="on" onChange={(e)=> {setError(""); setPassword(e.target.value)}}/>
        <button className="login__button">Enviar</button>
      </form>
    </section>

  )
}