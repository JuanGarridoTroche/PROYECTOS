import "../css/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserService } from "../services";
import Modal from "../components/Modal";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener más de 7 caracteres.");
      return;
    }

    try {
      await registerUserService({ username, email, password, bio });            
      navigate("/users/login");
      return <Modal setShowModal="true">Registro realizado correctamente</Modal>
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="register">
      <h2>Registro de nuevo usuario</h2>
      <p className="error">{error}</p>
      <form onSubmit={handleForm}>
        <fieldset>
          <h3>
            Nombre de usuario<span className="required"> *</span>
          </h3>
          <label htmlFor="username" className="summary-field">
            Escribe un nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="nombre de usuario..."
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
        </fieldset>
        <fieldset>
          <h3>
            Email<span className="required"> *</span>
          </h3>
          <label htmlFor="email" className="summary-field">
            Escribe un correo electrónico válido
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="escribe tu correo..."
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </fieldset>
        <fieldset>
          <h3>
            Contraseña<span className="required"> *</span>
          </h3>
          <label htmlFor="password" className="summary-field">
            Escribe tu contraseña con al menos 8 caracteres            
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>
            Sobre ti
          </h3>
          <label htmlFor="bio" className="summary-field">
            Una breve descripción sobre ti mismo para mostrar en tu perfil (opcional)
          </label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            rows="4"
            cols="50"
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </fieldset>
        <button>Registrarse</button>
      </form>
    </section>
  );
};
