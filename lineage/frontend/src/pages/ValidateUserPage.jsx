import ('../css/ValidateUSerPage.css')
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Message } from "../components/main/Message";
import { Modal } from "../components/main/Modal";
import { validateRegistrationCodeService } from "../services";

export const ValidateUserPage = ()=> {
  const {registrationCode} = useParams();
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");
  // console.log(registrationCode);

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");
    try {
      await validateRegistrationCodeService(registrationCode);
      setTitle("Validación de cuenta");
      setPage("ValidateUserPage")
      setMessage("Tu cuenta se ha activado con éxito")
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return(
    <section className="section--val-reg-code">      
      <h2 className="section__h2--val-reg-code h2--val-reg-code">Validación del código de registro</h2>
      <form onSubmit={handleSubmit} className="section__form--val-reg-code form--val-reg-code">
      {error ? <Message message={error} type="error"/> : null}
        <input defaultValue={registrationCode} className="form__input--val-reg-code"/>
        <button className="form__button--val-reg-code">Activar cuenta</button>
      </form>
      {showModal && (
        <Modal setShowModal={setShowModal} title={title} page={page}>
          <Message message={message} type="data"/>
        </Modal>
      )}
      

    </section>
  )
}