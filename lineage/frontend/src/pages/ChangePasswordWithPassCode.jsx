import { useState } from "react";
import { useParams } from "react-router-dom";
import { Message } from "../components/main/Message";
import { Modal } from "../components/main/Modal";
import { changePasswordWithPassCodeService } from "../services";

import("../css/ChangePasswordWithPassCode.css");

export const ChangePasswordWithPassCode = () => {
  const { recoverPassCode } = useParams();
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeated, setNewPasswordRepeated] = useState("");

  const handlePassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await changePasswordWithPassCodeService({
        recoverPassCode,
        newPassword,
        newPasswordRepeated,
      });
      setShowModal(true);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <section className="passcode">
      <h2 className="passcode__title">Cambio de contraseña</h2>
      {error ? <Message message={error} type="error" /> : null}
      <form className="passcode__form" onSubmit={handlePassword}>
        <h3 className="passcode__form__h3 passcode__form__passcode">
          Código de contraseña
        </h3>
        <label htmlFor="passcode" className="passcode__form__label">
          código de contraseña enviado a tu correo electrónico
        </label>
        <input
          type="text"
          className="passcode__form__input"
          defaultValue={recoverPassCode}
          required
        />
        <h3 className="passcode__form__h3">Nueva contraseña</h3>
        <label htmlFor="new-password" className="passcode__form__label">
          Debe tener como mínimo 8 caracteres y contener al menos un caracter en
          mayúsculas, minúsculas, un número y un caracter especial (!@#$%&*)
        </label>
        <input
          type="password"
          name="new-password"
          id="new-password"
          className="passcode__form__input"
          required
          autoComplete="on"
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <h3 className="passcode__form__h3">Repite la nueva contraseña</h3>
        <label
          htmlFor="new-password-repeated"
          className="passcode__form__label"
        >
          Repite la nueva contraseña
        </label>
        <input
          type="password"
          name="new-password-repeated"
          id="new-password-repeated"
          className="passcode__form__input"
          required
          autoComplete="on"
          onChange={(e) => {
            setNewPasswordRepeated(e.target.value);
          }}
        />
        <button className="passcode__form__button">Cambiar contraseña</button>
      </form>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title="Cambio de contraseña"
          page="ChangePasswordWithPassCodePage"
        >
          <Message message="Contraseña modificada con éxito" type="data" />
        </Modal>
      )}
    </section>
  );
};
