import "../css/login.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUserService } from "../services";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let [count, setCount] = useState(0);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {      
      const data = await loginUserService({ email, password });
      login(data.token);
      navigate("/");
    } catch (error) {
      setCount(++count);
      if(count > 2) {
        setCount(2);
      }
      error.message =[...error.message,`. ${count} ${count === 1  ? 'fallo.' : 'fallos.'}` ];
      setError(error.message);
    }
  };

  return (
    <section className="login">
      <h2>Iniciar sesión</h2>
      {error ? <p className="error">{error}</p> : null}
      <form onSubmit={handleSubmit}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="cuenta de correo"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          autoComplete="true"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button>Enviar</button>
      </form>
      <section className="dont-forget">
        <p className="link">¿Has olvidado tu nombre de <Link to="/users/password/solicitude">usuario o contraseña</Link>?</p>
        <p className="link">
          ¿Es tu primera vez en saawit? 
          <Link to="/register"> REGÍSTRATE</Link>
        </p>
      </section>
    </section>
  );
};
