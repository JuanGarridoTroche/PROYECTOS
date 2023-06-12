import("../css/CreateAccount.css");
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { AuthContext } from "../context/AuthContext";
import { createAccountService } from "../services";

export const CreateAccount = () => {
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const [alias, setAlias] = useState("");
  const [bankName, setBankName] = useState("");
  const [ibanCode, setIbanCode] = useState("");
  const [entityCode, setEntityCode] = useState("");
  const [officeCode, setOfficeCode] =useState("");
  const [digitControl, setDigitControl] = useState("");
  const [number, setNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = {alias, bankName, ibanCode, entityCode, officeCode, digitControl, number};
      await createAccountService({ data, token });
      setShowModal(true);
      e.target.reset();
      navigate("/accounts")
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="create-account-container">
      <h2><span>Crear una cuenta</span></h2>
      {error ? <label className="error">{error}</label> : null}
      <form className="create-account-form" onSubmit={handleSubmit}>
        <fieldset>
          <h3>Alias</h3>
          <label htmlFor="alias" className="alias">
            Escribe un nombre (alias) para tu nueva cuenta
          </label>
          <input
            type="text"
            name="alias"
            id="alias"
            required
            onChange={(e) => {
              setAlias(e.target.value);
            }}
          />
        </fieldset>
        <fieldset>
          <h3>Banco</h3>
          <label htmlFor="bankName" className="summary-field">
            Escribe el nombre de tu banco
          </label>
          <input type="text" name="bankName" id="bankName" onChange={(e)=> {
            setBankName(e.target.value)
          }}/>
        </fieldset>
        <fieldset>
          <h3>Número de cuenta</h3>
          <section className="account">
            <label htmlFor="ibanCode" hidden></label>
            <input
              type="text"
              name="ibanCode"
              id="ibanCode"
              required
              pattern="[A-Z]{2}[0-9]{2}"
              placeholder="ES21"
              className="iban-code"
              onChange={(e)=> {
                setIbanCode(e.target.value);
              }}
            />
            -<label htmlFor="entityCode" hidden></label>
            <input
              type="text"
              name="entityCode"
              id="entityCode"
              required
              pattern="[0-9]{4}"
              placeholder="1234"
              className="entity-code"
              onChange={(e)=> {
                setEntityCode(e.target.value)
              }}
            />
            -<label htmlFor="officeCode" hidden></label>
            <input
              type="text"
              name="officeCode"
              id="officeCode"
              required
              pattern="[0-9]{4}"
              placeholder="1234"
              className="office-code"
              onChange={(e)=> {
                setOfficeCode(e.target.value)
              }}
            />
            -<label htmlFor="digitControl" hidden></label>
            <input
              type="text"
              name="digitControl"
              id="digitControl"
              required
              pattern="[0-9]{2}"
              placeholder="12"
              className="digit-control"
              onChange={(e)=> {
                setDigitControl(e.target.value)
              }}
            />
            -<label htmlFor="number" hidden></label>
            <input
              type="text"
              name="number"
              id="number"
              required
              pattern="[0-9]{10}"
              placeholder="1234567890"
              className="account-number"
              onChange={(e)=> {
                setNumber(e.target.value)
              }}
            />
          </section>
        </fieldset>
        <button>Crear cuenta</button>
      </form>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          Cuenta creada!
        </Modal>
      )}
    </section>
  );
};
