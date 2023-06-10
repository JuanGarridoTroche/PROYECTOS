import '../css/NotFoundPage.css'
import { Link } from "react-router-dom";
import Modal from '../components/Modal.js'

export const ErrorMessage = ({ message }) => {
  return (
    <>
      <Modal >
        <section className='not-found-container'>
          <h2>{message}</h2>          
          <Link to="/">Volver a la página principal</Link>
        </section>
      </Modal>
    </>
  );
};
