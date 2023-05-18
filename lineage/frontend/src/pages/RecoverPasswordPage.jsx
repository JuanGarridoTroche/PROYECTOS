import { useState } from "react";
import { recoverPasswordSolicitudeService } from "../services";
import { Modal } from "../components/main/Modal";
import { Message } from "../components/main/Message";

import("../css/RecoverPassword.css");

export const RecoverPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");
    setShowModal(true)
    try {
      await recoverPasswordSolicitudeService(email);      
    } catch (err) {
      setError(err.message)
    }

  }

  return (
    <section className="recover-pwd">
      <h2 className="recover-pwd__title">
        Solicitud de recuperación de contraseña
      </h2>
      <form className="recover-pwd__form" onSubmit={handleSubmit}>
        <h3 className="recover-pwd__form--email">Correo electrónico</h3>
        <label htmlFor="email" className="recover-pwd__form__label">Introduzca el correo electrónico con el que se ha registrado. Le enviaremos un enlace para que pueda modificar su contraseña.</label>
      {error ? <Message message={error} type="error"/> : null}
        <input type="email" name="email" id="email" placeholder="correo@electronico.com" className="recover-pwd__form__input" onChange={(e) => {setEmail(e.target.value)}}/>
        <button className="recover-pwd__form__button">Enviar</button>
      </form>
      {showModal && (
        <Modal setShowModal={setShowModal} title="Enviado correo de recuperación de contraseña" page="RecoverPasswordPage">
          <Message message="Revisa tu correo para modificar tu contraseña en Lineage" type="data"/>
        </Modal>
      )}
    </section>   
  );
};
