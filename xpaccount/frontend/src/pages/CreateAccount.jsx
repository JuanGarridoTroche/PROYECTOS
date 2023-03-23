
export const CreateAccount = ()=> {

  return(
    <section className="create-account-container">
      <h2>Crear una cuenta nueva</h2>
      <form>
        <label htmlFor="alias">Escribe un nombre (alias) para tu nueva cuenta</label>
        <input type="text" name="alias" id="alias" required/>
        <label htmlFor="bankName">Banco</label>
        <input type="text" name="bankName" id="bankName"/>
        <label htmlFor="ibanCode"></label>
        <input type="text" name="ibanCode" id="ibanCode" required pattern="[A-Z]{2}[0-9]{2}"/>
        <label htmlFor="entityCode"></label>
        <input type="text" name="entityCode" id="entityCode" required/>
        <label htmlFor="officeCode"></label>
        <input type="number" name="officeCode" id="officeCode" required/>
        <label htmlFor="digitControl"></label>
        <input type="number" name="digitControl" id="digitControl" required/>
        <label htmlFor="numberAccount"></label>
        <input type="number" name="numberAccount" id="numberAccount" required/>
        <button>Crear cuenta</button>
      </form>
    </section>
  )
}