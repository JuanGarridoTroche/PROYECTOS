import { useState } from "react";
import { Modal } from "../../../../xpaccount/frontend/src/components/Modal";
import { Message } from "../components/main/Message";
import { Link } from "react-router-dom";

import("../css/RegisterPage.css");
export const RegisterPage = () => {
  const[showModal, setShowModal] = useState("");
  const [error, setError] = useState("");
  return (
    <section className="section-main">
      <details className="section-main__details details">
        <summary className="details__summary">Registro de usuario</summary>
        <p className="details__p">
          Regístrate en nuestra aplicación para tener acceso a todos los
          servicios de Linea<span className="g">g</span>e
        </p>
      </details>
      <section className="section-main__section--content section--content">
      {error ? <Message message={error} type="error"/> : null}
        <form className="section-main__form form">
          <fieldset className="form__fieldset form__fieldset--first_name fieldset--first-name">
            <h3 className="h3 fieldset__h3--first_name">Nombre</h3>
            <label htmlFor="first_name" className="label fieldset__label--first-name">
              Escribe tu nombre
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              autoComplete="on"
              placeholder="Nombre"
              required
              className="input fieldset__input fieldset__input--first-name"
            />
          </fieldset>
          <fieldset className="form__fieldset form__fieldset--last_name1 fieldset--last-name1">
            <h3 className="h3 fieldset__h3--last_name1">Primer apellido</h3>
            <label htmlFor="last_name1" className="label fieldset__label--last-name1">
              Escribe tu primer apellido
            </label>
            <input
              type="text"
              name="last_name1"
              id="last_name1"
              autoComplete="on"
              placeholder="Primer apellido"
              required
              className="input fieldset__input fieldset__input--last-name1"
            />
          </fieldset>
          <fieldset className="form__fieldset form__fieldset--last_name2 fieldset--last-name2">
            <h3 className="h3 fieldset__h3--last_name2">Segundo apellido</h3>
            <label htmlFor="last_name2" className="label fieldset__label--last-name2">
              Escribe tu segundo apellido
            </label>
            <input
              type="text"
              name="last_name2"
              id="last_name2"
              autoComplete="on"
              placeholder="Segundo apellido"
              className="input fieldset__input fieldset__input--last-name2"
              required
            />          
          </fieldset>
          <fieldset className="form__fieldset form__fieldset--email fieldset--email">
            <h3 className="h3 fieldset__h3--email">Correo electrónico</h3>
            <label htmlFor="email" className="label fieldset__label--email">
              Escribe tu dirección de correo electrónico
            </label>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="on"
              placeholder="correo@electronico.com"
              required
              className="input fieldset__input fieldset__input--email"
            />
          </fieldset>
          <button className="section-main__form__button section-main__button button">Registrar</button>
          <p className="section-main__form__p--login p--login">¿Ya tienes una cuenta? <Link to={"/login"}>iniciar sesión</Link></p>
        </form>
      </section>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          Usuario creado!
          Revisa tu correo para activar la cuenta
        </Modal>
      )}
    </section>
  );
};
