import ("../css/CreateAccount.css")
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { createAccountService } from "../services";

export const CreateAccount = ()=> {
  const [error, setError] = useState("");
  const {logged, token} =useContext(AuthContext);  

  const handleSubmit = async (e)=> {
    e.preventDefault();
    setError("");
    try {
      await createAccountService({token});
      
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
          <label htmlFor="alias" className="summary-field">Escribe un nombre (alias) para tu nueva cuenta</label>
          <input type="text" name="alias" id="alias" required/>
        </fieldset>
        <fieldset>
          <h3>Banco</h3>
          <label htmlFor="bankName" className="summary-field">Escribe el nombre de tu banco</label>
          <input type="text" name="bankName" id="bankName"/>
        </fieldset>
        <fieldset>
          <h3>Número de cuenta</h3>
          <section className="account">
            <label htmlFor="ibanCode" hidden></label>
            <input type="text" name="ibanCode" id="ibanCode" required pattern="[A-Z]{2}[0-9]{2}" placeholder="ES21" className="iban-code"/>-         
            <label htmlFor="entityCode" hidden></label>
            <input type="text" name="entityCode" id="entityCode" required pattern="[0-9]{4}" placeholder="1234" className="entity-code"/>- 
            <label htmlFor="officeCode" hidden></label>
            <input type="text" name="officeCode" id="officeCode" required pattern="[0-9]{4}" placeholder="1234" className="office-code"/>- 
            <label htmlFor="digitControl" hidden></label>
            <input type="text" name="digitControl" id="digitControl" required pattern="[0-9]{2}" placeholder="12" className="digit-control"/>- 
            <label htmlFor="accountNumber" hidden></label>
            <input type="text" name="accountNumber" id="accountNumber" required pattern="[0-9]{10}" placeholder="1234567890" className="account-number"/>
          </section>
        </fieldset>
        <button>Crear cuenta</button>
      </form>
    </section>
  )
}