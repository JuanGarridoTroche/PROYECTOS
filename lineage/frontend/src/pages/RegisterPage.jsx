import("../css/Page.css");
export const RegisterPage = () => {
  return (
    <section className="section-main">
      <details className="section-main__details details">
        <summary className="details__summary">Registro de usuario</summary>
        <p className="details__p">
          Regístrate en nuestra aplicación para tener acceso a todos los
          servicios de Linea<span className="g">g</span>e
        </p>
      </details>
      <form className="section-main__form form">
        <fieldset className="form__fieldset-first-name fieldset-first-name">
          <h3 className="fieldset-first-name__h3">Nombre</h3>
          <label htmlFor="first_name" className="fieldset-first-name__label--summary">
            Escribe tu nombre
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            autoComplete="on"
            placeholder="Nombre"
            required
            className="fieldset-first-name__input"
          />
        </fieldset>
        <fieldset className="form__fieldset-last-name1 fieldset-last-name1">
          <h3 className="fieldset-last-name1__h3">Nombre</h3>
          <label htmlFor="first_name" className="fieldset-last-name1__label--summary">
            Escribe tu nombre
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            autoComplete="on"
            placeholder="Nombre"
            required
            className="fieldset-first-name__input"
          />
        </fieldset>
      </form>
    </section>
  );
};
