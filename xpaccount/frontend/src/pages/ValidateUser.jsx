import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../components/Modal";
import { validateUserService } from "../services";

export const ValidateUSer = () => {
  const [showModal, setShowModal] = useState(false);
  const [validate, setValidate] = useState([]);
  const {registrationCode} = useParams();
  const navigate = useNavigate();
  
  
  const handleSubmit = async (e)=> {
    e.preventDefault();
    setShowModal(true)
    const validateUser =  await validateUserService(registrationCode);
    setValidate(validateUser);
    console.log(validate.message);
  }


  return (
    <section className="validate-user">
      <h2>Validar usuario</h2>
      <form onSubmit={handleSubmit}>
        <input value={registrationCode}/>
        <button>Activar</button>
      </form>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          Cuenta activa!
          {validate.error}
        </Modal>
      )}
    </section>
  );
};
