import "../css/PassCodeSolicitude.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passCodeSolicitudeService } from "../services";

export const PassCodeSolicitude = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await passCodeSolicitudeService({ email });
      navigate("/users/password/recover");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="passcode-solicitude">
      <h2>Solicitud de recuperación de contraseña</h2>
      {error ? <p className="error">{error}</p> : null}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Introduzca el correo electrónico de su cuenta. Le enviaremos un código
          necesario para poder reeescribir su contraseña
        </label>
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

        <button>Enviar</button>
      </form>
    </section>
  );
};
