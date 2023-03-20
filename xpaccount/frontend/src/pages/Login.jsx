import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUserService } from "../services";
import {AuthContext} from "../context/AuthContext";

import("../css/Login.css");
export const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUserService({email, pwd});      
      login(data.token);
      navigate("/");
      
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="login-container">
      <details className="login-summary">
        <summary>Login</summary>
        <p>
          Accede a la aplicación con tu cuenta de correo como usuario y
          contraseña para acceder a todos los servicios de la web
        </p>
      </details>
      <section className="login-content">
        {error ? <p className="error-message">{error}</p> : null}
        <form onSubmit={handleSubmit}>
          <label htmlFor="userLogin">Usuario:</label>
          <input
            type="text"
            name="userLogin"
            id="userLogin"
            placeholder="micuenta@midominio.com" 
            autoComplete="username"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="pwd">Contraseña:</label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            placeholder="Introduce tu contraseña" 
            autoComplete="current-password"
            onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
          <button>Login</button>
        </form>
        <section className="dont-forget">
          <p className="link">¿Has olvidado tu nombre de <Link to="/users/password/solicitude">usuario o contraseña</Link>?</p>
          <p className="link">
          ¿Es tu primera vez en <span>xp</span>account? 
          <Link to="/register"> REGÍSTRATE</Link>
        </p>
        </section>
      </section>
    </section>
  );
};
