import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getLoggedUserDataService,
  updateLoggedUserDataService,
  updatePasswordService,
} from "../services";
import { Modal } from "../components/main/Modal";
import { Message } from "../components/main/Message";
import("../css/UserProfilePage.css");

export const UserProfilePage = () => {
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeated, setNewPasswordRepeated] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");

  // useEffect que traiga todos los datos del usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getLoggedUserDataService(token);
        setEmail(user.email);
        setFirstName(user.first_name);
        setLastName1(user.last_name1);
        setLastName2(user.last_name2);
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) {
      loadUser();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = {
        newEmail: email,
        first_name: firstName,
        last_name1: lastName1,
        last_name2: lastName2,
      };
      console.log("handleSubmit :", data);
      await updateLoggedUserDataService(token, data);
      setTitle("Usuario actualizado");
      setPage("UserProfilePAge");
      setMessage("Perfil de usuario actualizado!")
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePassword = async(e)=> {    
    e.preventDefault();
    setError("");
    try {
      if(newPassword !== newPasswordRepeated) {
        setError(err.message);
      }
      await updatePasswordService({token, password, newPassword, newPasswordRepeated});
      setTitle("Contraseña actualizada");
      setPage("updatePasswordPage");
      setMessage("Contraseña actualizada. Por favor, vuelve a loguearte con la nueva contrseña")
      setShowModal(true)
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="profile">
      <h2 className="profile__header">Perfil de usuario</h2>
      <section className="profile__content">
        {error ? <Message message={error} type="error" /> : null}
        <form className="profile__form" onSubmit={handleSubmit}>
          <fieldset className="profile__fieldset profile__fieldset__email profile__email">
            <h3 className="profile__title profile__email__title">
              Correo electrónico
            </h3>
            <label
              htmlFor="email"
              className="profile__label profile__email__label"
            >
              Actualiza tu dirección de correo electrónico
            </label>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="on"
              placeholder="correo@electronico.com"
              value={email}
              className="profile__input profile__email__input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
          <fieldset className="profile__fieldset profile__fieldset__name profile__name">
            <h3 className="profile__title profile__name__title">Nombre</h3>
            <label
              htmlFor="first_name"
              className="profile__label profile__name__label"
            >
              Actualiza tu nombre
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={firstName}
              autoComplete="on"
              placeholder="Nombre"
              required
              className="profile__input profile__name__input"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </fieldset>
          <fieldset className="profile__fieldset profile__fieldset__surname profile__surname">
            <h3 className="profile__title profile__last-name1__title">
              Apellidos
            </h3>
            <label
              htmlFor="last_name1"
              className="profile__label profile__last-name1__label"
            >
              Modifica tus apellidos
            </label>
            <div className="surname">
              <input
                type="text"
                name="last_name1"
                id="last_name1"
                value={lastName1}
                autoComplete="on"
                placeholder="Primer apellido"
                required
                className="profile__input profile__last-name1__input"
                onChange={(e) => setLastName1(e.target.value)}
              />
              <label
                htmlFor="last_name2"
                className="profile__label profile__last-name2__label"
                hidden
              >
                Actualiza tu segundo apellido
              </label>
              <input
                type="text"
                name="last_name2"
                id="last_name2"
                value={lastName2}
                autoComplete="on"
                placeholder="Segundo apellido"
                className="profile__input profile__last-name2__input"
                required
                onChange={(e) => setLastName2(e.target.value)}
              />
            </div>
          </fieldset>
          <button className="profile__form__button">Actualizar</button>
        </form>
        <form
          className="profile__form profile__form__password profile__password"
          onSubmit={handlePassword}
        >
          <fieldset className="profile__fieldset profile__fieldset__password profile__password">
            <h3 className="profile__title profile__password__title">
              Contraseña
            </h3>
            <label
              htmlFor="password"
              className="profile__label profile__password__label"
            >
              Debe tener como mínimo 8 caracteres y contener al menos un
              caracter en mayúsculas, minúsculas, un número y un caracter
              especial (!@#$%&*)
            </label>
            <section className="section__password">
              <section className="section__password--orig">
                <p>Contraseña actual:</p>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="on"
                  required
                  className="profile__input profile__password__input profile__password__input--orig"
                  onChange={(e) => setPassword(e.target.value)}
                  />
              </section>
              <section className="section__password--new">
                <p>Nueva contraseña:</p>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  autoComplete="on"
                  required
                  className="profile__input profile__password__input profile__password__input--newPassword"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  name="newPasswordRepeated"
                  id="newPasswordRepeated"
                  autoComplete="on"
                  required
                  className="profile__input profile__password__input"
                  onChange={(e) => setNewPasswordRepeated(e.target.value)}
                />
  
              </section>
            </section>
          </fieldset>
          <button className="profile__form__button profile_button--password">Cambiar contraseña</button>
        </form>
      </section>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title={title}
          page={page}
        >
          <Message message={message} type="data" />
        </Modal>
      )}
    </section>
  );
};
