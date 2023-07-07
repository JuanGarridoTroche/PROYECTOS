import '../css/Modal.css';
import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { updatePDFService } from '../services';
import { AuthContext } from '../contexts/AuthContext';

// Pinta un modal blanco con un fondo oscuro. El contenido del modal es lo recibido en la prop children. También recibe setShowModal para poder cerrar el modal cuando hagamos click en el fondo oscuro
const UpdatePdfModal = ({ pdfToChange, setShowModal }) => {
  const [newPDF, setNewPDF] = useState();
  const [error, setError] = useState("");
  const {url} = useParams();
  const {token} = useContext(AuthContext);
  
  const handlePdf = async(e) => {
    e.preventDefault();
    try {
      const uploadPDF = structuredClone(newPDF);
      const sendFile = await updatePDFService(token, url, uploadPDF);
      console.log(sendFile);
    } catch (error) {
      setError(error.message);
    }
      
  };


  return (
    <div
      className="modalBg"
      onClick={(e) => {
        // Cuando colocamos el modal dentro de una entry, al hacer click en el fondo oscuro se activa el Link que envuelve la Entry. Para solucionar esto llamamos a event.preventDefault()
        e.preventDefault();
        // Cerramos el modal cambiando el estado showModal a false
        setShowModal(false);
      }}
    >
      <div
        className="modalContainer"
        onClick={(e) => {
          // Si activo este preventDefault no me funcionan los botones del formulario
          // e.preventDefault();
          // Cuando hacemos click en el contenido del modal (lo blanco), cancelamos la propagación para que no se active el onClick del fondo del modal (lo oscuro)
          e.stopPropagation();
        }}
      >
        <h3 className="pdf-to-change__title">Fichero que vamos a modificar</h3>
        <form className="pdf-to-change" onSubmit={handlePdf}>
          <label className="pdf-to-change__label" htmlFor="uploadPDF">
            {pdfToChange}
          </label>
          <input
            className="pdf-to-change__file"
            type="file"
            name="uploadPDF"
            id="uploadPDF"
            required
            onChange={(e) => setNewPDF(e.target.files)}
          />
          <button className="pdf-to-change__button">Cambiar</button>
        </form>
        <div
          className="close"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(false);
          }}
        >
          X
        </div>
      </div>
    </div>
  );
};

export default UpdatePdfModal;

UpdatePdfModal.propTypes = {
  pdfToChange: PropTypes.any,
  setShowModal: PropTypes.any,
};
