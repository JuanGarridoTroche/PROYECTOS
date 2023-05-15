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
    <section className="section--profile">      
      <section className="section--profile__section--content">
        {error ? <Message message={error} type="error"/> : null}
        <form className="section-main__form form" onSubmit={handleSubmit}>
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
          <fieldset className="form__fieldset form__fieldset--password fieldset--password">
            <h3 className="h3 fieldset__h3--password">Contraseña</h3>
            <label htmlFor="password" className="label fieldset__label--password">
              Debe tener como mínimo 8 caracteres y contener al menos un caracter en mayúsculas, minúsculas, un número y un caracter especial (!@#$%&*)
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="on"
              required
              className="input fieldset__input fieldset__input--password"
              onChange={(e)=> setPassword(e.target.value)}
            />
          </fieldset>
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
              onChange={(e)=> setFirstName(e.target.value)}
            />
          </fieldset>
          <fieldset className="form__fieldset form__fieldset--last_name1 fieldset--last-name1">
            <h3 className="h3 fieldset__h3--last_name1">Apellidos</h3>
            <label htmlFor="last_name1" className="label fieldset__label--last-name1">
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
                className="input fieldset__input fieldset__input--last-name1"
                onChange={(e) => setLastName1(e.target.value)}
              />
            <label htmlFor="last_name2" className="label fieldset__label--last-name2" hidden>
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
                onChange={(e) => setLastName2(e.target.value)}
              />
            </div>
          </fieldset>
          <button className="section-main__form__button section-main__button button">Registrar</button>
          <p className="section-main__form__p--login p--login">¿Ya tienes una cuenta? <Link to={"/login"}>iniciar sesión</Link></p>
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
