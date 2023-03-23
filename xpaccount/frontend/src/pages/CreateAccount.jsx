import { useState } from "react";

export const CreateAccount = ()=> {
  const [error, setError] = useState("")

  const handleSubmit = async (e)=> {
    e.preventDefault();
    setError("");
    try {
      
    } catch (error) {
      setError(error.message);
    }
  }

  return(
    <section className="create-account-container">
      <h2>Crear una cuenta nueva</h2>
      <p className="error">{error}</p>
      <form className="create-account-form" onSubmit={handleSubmit}>
        <fieldset>
          <h3>Alias</h3>
          <label htmlFor="alias">Escribe un nombre (alias) para tu nueva cuenta</label>
          <input type="text" name="alias" id="alias" required/>
        </fieldset>
        <fieldset>
          <h3>Banco</h3>
          <label htmlFor="bankName">Banco</label>
          <input type="text" name="bankName" id="bankName"/>
        </fieldset>
        <fieldset>
          <h3>Número de cuenta</h3>
          <label htmlFor="ibanCode"></label>
          <input type="text" name="ibanCode" id="ibanCode" required pattern="[A-Z]{2}[0-9]{2}" placeholder="ES21"/>          
          <label htmlFor="entityCode"></label>
          <input type="text" name="entityCode" id="entityCode" required pattern="[0-9]{4}" placeholder="1234"/>
          <label htmlFor="officeCode"></label>
          <input type="text" name="officeCode" id="officeCode" required pattern="[0-9]{4}" placeholder="1234"/>
          <label htmlFor="digitControl"></label>
          <input type="text" name="digitControl" id="digitControl" required pattern="[0-9]{2}" placeholder="12"/>
          <label htmlFor="numberAccount"></label>
          <input type="text" name="numberAccount" id="numberAccount" required pattern="[0-9]{10}" placeholder="1234567890"/>
        </fieldset>
        <button>Crear cuenta</button>
      </form>
    </section>
  )
}