import ("../css/Register.css");
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { registerUserService } from "../services";

export const Register =()=> {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async(e)=> {
    const data = {username, email, password, birthday, firstName, lastName, dni};    
    e.preventDefault();
    setError("");
    try {
      await registerUserService(data);
      setShowModal(true);
      e.target.reset();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  }

  return(
    <section className="register-container">
      <h2>Nuevo usuario</h2>
      {error ? <label className="error">{error}</label> : null}
      <form action="" className="register-form" onSubmit={handleSubmit}>
        <fieldset>
          <h3>Nombre de usuario</h3>
          <label htmlFor="username" className="summary-field">
            Escribe un nombre de usuario.
          </label>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="on"
            placeholder="nombre de usuario"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>Correo electrónico</h3>
          <label htmlFor="email"  className="summary-field">
            Escribe una cuenta de correo electrónica.
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder="correo@electronico.com"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>Contraseña</h3>
          <label htmlFor="password"  className="summary-field">
            Escribe tu contraseña. Debe ser mayor de 8 caracteres.
          </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="new-password"
            placeholder="mi contraseña"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>Fecha de nacimiento</h3>
          <label htmlFor="birthday"  className="summary-field">
            Escribe tu fecha de nacimiento(dd/mm/aaaa).
          </label>
          <input
            type="date"
            name="birthday"
            id="birthday"
            placeholder="31/12/1970"
            onChange={(e) => {
              setBirthday(e.target.value);
            }}
          />
        </fieldset>
        <section className="data">

        <fieldset>
          <h3>Nombre</h3>
          <label htmlFor="birthday"  className="summary-field">
            Escribe tu nombre.
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Nombre propio"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>Apellidos</h3>
          <label htmlFor="lastName"  className="summary-field">
            Escribe tus apellidos
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Mis Apellidos"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>DNI</h3>
          <label htmlFor="birthday"  className="summary-field">
            Escribe tu documento nacional de identidad.
          </label>
          <input
            type="text"
            name="dni"
            id="dni"
            placeholder="12345678L"
            onChange={(e) => {
              setDni(e.target.value);
            }}
          />
        </fieldset>
        </section>
        <button>Nuevo usuario</button>
      </form>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          Usuario creado!
          Revisa tu correo para activar la cuenta
        </Modal>
      )}
    </section>
  )
}