import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getLoggedUserDataService } from "../services";
import { Modal } from "../components/main/Modal";
import { Message } from "../components/main/Message";
import { Link } from "react-router-dom";
import("../css/UserProfilePage.css");


export const UserProfilePage = () => {
  const {token} = useContext(AuthContext);
  const [authUser, setAuthUser] = useState("");
  const[showModal, setShowModal] = useState("");
  const [error, setError] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name1, setLastName1] = useState("");
  const [last_name2, setLastName2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // useEffect que traiga todos los datos del usuario
  useEffect(()=> {
    const loadUser = async()=> {
      const data = await getLoggedUserDataService(token);
      setAuthUser(data);
    }
    if(token) {loadUser();}
  },[])



  const handleSubmit = async()=> {
    
  }

  return (
    <section className="profile"> 
      <h2 className="profile__header">Perfil de usuario</h2>    
      <section className="profile__content">
        {error ? <Message message={error} type="error"/> : null}
        <form className="profile__form" onSubmit={handleSubmit}>
          <fieldset className="profile__fieldset profile__fieldset__email profile__email">
            <h3 className="profile__title profile__email__title">Correo electrónico</h3>
            <label htmlFor="email" className="profile__label profile__email__label">
              Escribe tu dirección de correo electrónico
            </label>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="on"
              placeholder="correo@electronico.com"
              required
              className="profile__input profile__email__input"
              disabled
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
          <fieldset className="profile__fieldset profile__fieldset__password profile__password">
            <h3 className="profile__title profile__password__title">Contraseña</h3>
            <label htmlFor="password" className="profile__label profile__password__label">
              Debe tener como mínimo 8 caracteres y contener al menos un caracter en mayúsculas, minúsculas, un número y un caracter especial (!@#$%&*)
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="on"
              required
              className="profile__input profile__password__input"
              onChange={(e)=> setPassword(e.target.value)}
            />
          </fieldset>
          <fieldset className="profile__fieldset profile__fieldset__name profile__name">
            <h3 className="profile__title profile__name__title">Nombre</h3>
            <label htmlFor="first_name" className="profile__label profile__name__label">
              Escribe tu nombre
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              autoComplete="on"
              placeholder="Nombre"
              required
              className="profile__input profile__name__input"
              onChange={(e)=> setFirstName(e.target.value)}
            />
          </fieldset>
          <fieldset className="profile__fieldset profile__fieldset__surname profile__surname">
            <h3 className="profile__title profile__last-name1__title">Apellidos</h3>
            <label htmlFor="last_name1" className="profile__label profile__last-name1__label">
              Escribe tus apellidos
            </label>
            <div className="surname">
              <input
                type="text"
                name="last_name1"
                id="last_name1"
                autoComplete="on"
                placeholder="Primer apellido"
                required
                className="profile__input profile__last-name1__input"
                onChange={(e) => setLastName1(e.target.value)}
              />
            <label htmlFor="last_name2" className="profile__label profile__last-name2__label" hidden>
              Escribe tu segundo apellido
            </label>                
              <input
                type="text"
                name="last_name2"
                id="last_name2"
                autoComplete="on"
                placeholder="Segundo apellido"
                className="profile__input profile__last-name2__input"
                required
                onChange={(e) => setLastName2(e.target.value)}
              />
            </div>
          </fieldset>
          <button className="profile__form__button">Registrar</button>
          <p className="profile__form__p__login profile__login">¿Ya tienes una cuenta? <Link to={"/login"} className="profile__p__link profile__link">iniciar sesión</Link></p>
        </form>
    </section>
      {showModal && (
        <Modal setShowModal={setShowModal} title="Usuario creado!">
          <Message message="Revisa tu correo para activar la cuenta en Lineage" type="data"/>
        </Modal>
      )}
  </section>
  );
};
