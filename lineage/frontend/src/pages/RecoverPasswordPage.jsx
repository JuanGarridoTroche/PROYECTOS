import("../css/RecoverPassword.css");

export const RecoverPasswordPage = () => {
  return (
    <section className="recover-pwd">
      <h2 className="recover-pwd__title">
        Solicitud de recuperación de contraseña
      </h2>
      <form className="recover-pwd__form">
        <h3 className="recover-pwd__form--email">Correo electrónico</h3>
        <label htmlFor="email" className="recover-pwd__form__label">Introduzca el correo electrónico con el que se ha registrado. Le enviaremos un enlace para que pueda modificar su contraseña.</label>
        <input type="email" name="email" id="email" placeholder="correo@electronico.com" className="recover-pwd__form__input"/>
        <button className="recover-pwd__form__button">Enviar</button>
      </form>
    </section>
  );
};
