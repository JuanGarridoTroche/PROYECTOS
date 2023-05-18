import { useState } from "react";
import { useParams } from "react-router-dom"

import ("../css/ChangePasswordWithPassCode.css")
export const ChangePasswordWithPassCode = ()=> {
  const {recoverPassCode} = useParams();
  const [error, setError] =useState("");


  handlePassword = async(e)=> {
    e.preventDefault();
    setError("");
    
  }

  return (
    <section className="passcode">
      <h2 className="passcode__title">Cambio de contraseña</h2>
      <form className="passcode__form">
        <h3 className="passcode__form__h3 passcode__form__passcode">Código de contraseña</h3>
        <label htmlFor="passcode" className="passcode__form__label">código de contraseña enviado a tu correo electrónico</label>        
        <input type="text" className="passcode__form__input" defaultValue={recoverPassCode} required/>
        <h3 className="passcode__form__h3">Nueva contraseña</h3>
        <label htmlFor="newPassword" className="passcode__form__label">Debe tener como mínimo 8 caracteres y contener al menos un caracter en mayúsculas, minúsculas, un número y un caracter especial (!@#$%&*)</label>
        <input type="password" className="passcode__form__input" required/>
        <h3 className="passcode__form__h3">Repite la nueva contraseña</h3>
        <label htmlFor="newPassword" className="passcode__form__label">Repite la nueva contraseña</label>
        <input type="password" className="passcode__form__input" required/>
        <button className="passcode__form__button">Cambiar contraseña</button>
      </form>
    </section>
  )
}