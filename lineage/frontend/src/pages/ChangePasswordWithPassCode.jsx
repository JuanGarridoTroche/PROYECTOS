import { useParams } from "react-router-dom"

import ("../css/ChangePasswordWithPassCode.css")
export const ChangePasswordWithPassCode = ()=> {
  const {recoverPassCode} = useParams();

  return (
    <section className="passcode">
      <h2 className="passcode__title">Cambio de contraseña</h2>
      <form className="passcode__form">
        <h3 className="passcode__form__h3 passcode__form__passcode">Código de contraseña</h3>
        <label htmlFor="passcode" className="passcode__form__label">código de contraseña enviado a tu correo electrónico</label>        
        <input type="text" className="passcode__form__input" defaultValue={recoverPassCode}/>
        <h3 className="passcode__form__h3">Nueva contraseña</h3>
        <label htmlFor="newPassword" className="passcode__form__label">Introduzca la nueva contraseña</label>
        <input type="password" className="passcode__form__input" />
        <h3 className="passcode__form__h3">Nueva contraseña</h3>
        <label htmlFor="newPassword" className="passcode__form__label">Introduzca la nueva contraseña</label>
        <input type="password" className="passcode__form__input" />
        <button className="passcode__form__button">Cambiar contraseña</button>
      </form>
    </section>
  )
}