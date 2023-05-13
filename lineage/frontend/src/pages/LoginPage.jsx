import("../css/Page.css");
import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUserService } from "../services";
import { Message } from "../components/main/Message";


export const LoginPage = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDeafult();
    setError("");

    try {
      const data = await loginUserService(email, password);
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section-main">
      <details className="section-main__details details">
        <summary className="details__summary">Login</summary>
        <p className="details__p">
          Entra en nuestra aplicación con tu cuenta de correo y
          contraseña para acceder a todos los servicios de Linea<span className="g">g</span>e
        </p>
      </details>
      <section className="section-main__section-content section-content">
        {error ? <Message message={error} type="error"/> : null}
        <form onSubmit={handleSubmit} className="section-content__form">
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
              setPassword(e.target.value);
            }}
          />
          <button>Login</button>
        </form>
        <section className="section-main__section-dont-forget section-dont-forget">
          <p className="link">
            ¿Has olvidado tu nombre de{" "}
            <Link to="/users/password/solicitude">usuario o contraseña</Link>?
          </p>
          <p className="link">
            ¿Es tu primera vez en <span>xp</span>account?
            <Link to="/register"> REGÍSTRATE</Link>
          </p>
        </section>
      </section>
    </section>
  );
};
