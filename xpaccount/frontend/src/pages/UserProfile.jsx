import("../css/UserProfile.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const UserProfile = () => {
  const { logged, token } = useContext(AuthContext);
  const [error, setError] = useState("");  
  const {username, email} = logged;  
  const [birthday, setBirthday] = useState(logged?.birthday);
  const [firstName, setFirstName] = useState(logged?.firstName);
  const [lastName, setLastName] = useState(logged?.lastName);
  const [dni, setDni] = useState(logged?.dni);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = {username, email, birthday, firstName, lastName, dni};
    console.log(data);
  }

  return (
    <section className="user-profile-container">
      <h2>Perfil de usuario</h2>
      <section>
        <form className="user-profile-form" onSubmit={handleSubmit}>
          <fieldset className="onlyread-data">
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" readOnly value={username} disabled/>
            <label htmlFor="email">Correo</label>
            <input type="text" readOnly value={email} disabled/>
          </fieldset>
          <fieldset className="update-data">
            <label htmlFor="birthday">Fecha de nacimiento</label>
            <input
              type="text"
              name="birthday"
              id="birthday"
              value={birthday}
              onChange={(e)=>{
                setBirthday(e.target.value)
              }}
            />
            <label htmlFor="firstName">Nombre</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <label htmlFor="lastName">Apellidos</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <label htmlFor="dni">Documento Nacional de Identidad</label>
            <input
              type="text"
              name="dni"
              id="dni"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value);
              }}
            />
          </fieldset>
          <button>Actualizar</button>
        </form>
      </section>
    </section>
  );
};
