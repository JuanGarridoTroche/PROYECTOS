import("../css/UserProfile.css");
import { useContext, useEffect, useState } from "react";
import { Modal } from "../components/Modal";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfileService } from "../services";

export const UserProfile = () => {
  const { logged, token } = useContext(AuthContext);
  const [error, setError] = useState("");  
  const username = logged?.username || "";  
  const email = logged?.email || "";
  const [birthday, setBirthday] = useState(logged?.birthday);
  const [firstName, setFirstName] = useState(logged?.firstName);
  const [lastName, setLastName] = useState(logged?.lastName);
  const [dni, setDni] = useState(logged?.dni);
  const [showModal, setShowModal] = useState(false); 
  
  useEffect(()=>{
    setBirthday(logged?.birthday);
    setFirstName(logged?.firstName);
    setLastName(logged?.lastName);
    setDni(logged?.dni);

  }, [showModal])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");

    try {
      const data = {username, email, birthday, firstName, lastName, dni};      
      await updateUserProfileService({token, data});
      setShowModal(true);
      
    } catch (err) {
      setError(err.message)
    }


  }

  return (
    <section className="user-profile-container">
      <h2>Perfil de usuario</h2>
      {error ? <label className="error">{error}</label> : null}
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
      {showModal && (
        <Modal setShowModal={setShowModal}>
        Usuario actualizado!
      </Modal>
      )}
    </section>
  );
};
