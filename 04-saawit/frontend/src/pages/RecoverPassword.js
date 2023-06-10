import "../css/RecoverPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recoverPasswordService } from "../services";

export const RecoverPassword = () => {
  const [recoverPassCode, setRecoverPassCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeated, setNewPasswordRepeated] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await recoverPasswordService({ recoverPassCode, newPassword, newPasswordRepeated });
      navigate("/users/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="recover-password">
      <h2>Recuperación de contraseña</h2>
      {error ? <p className="error">{error}</p> : null}
      <form onSubmit={handleSubmit}>
        <label htmlFor="passcode">
          Introduzca el código que le ha llegado a su cuenta de correo electrónico y la contraseña deseada 2 veces. Todos los campos son obligatorios
        </label>
        <input
          id="recoverPassCode"
          name="recoverPassCode"
          type="text"
          placeholder="introduzca su código"
          required
          onChange={(e) => {
            setRecoverPassCode(e.target.value);
          }}
        />
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="contraseña"
          required
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <input
          id="newPasswordRepeated"
          name="newPasswordRepeated"
          type="password"
          placeholder="repetir contraseña"
          required
          onChange={(e) => {
            setNewPasswordRepeated(e.target.value);
          }}
        />

        <button>Enviar</button>
      </form>
    </section>
  );
};
