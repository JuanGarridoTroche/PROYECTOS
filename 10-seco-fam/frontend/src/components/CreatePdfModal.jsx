import '../css/Modal.css';
import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { createPDFService } from '../services';
import { AuthContext } from '../contexts/AuthContext';

// Pinta un modal blanco con un fondo oscuro. El contenido del modal es lo recibido en la prop children. También recibe setShowModal para poder cerrar el modal cuando hagamos click en el fondo oscuro
const UpdatePdfModal = ({
  updatePdfList,
  setUpdatePdfList,
  pdfToChange,
  setShowModal,
}) => {
  const [newPDF, setNewPDF] = useState(null);
  const [error, setError] = useState('');
  const { url } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePdf = async (e) => {
    e.preventDefault();
    try {
      const uploadPDF = new FormData();
      uploadPDF.append('uploadPDF', newPDF);
      await createPDFService(token, url, uploadPDF);
      setUpdatePdfList(!updatePdfList);
      setShowModal(false);
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
        <h3 className="pdf-to-upload__title">
          Subir un fichero para la familia {url}
        </h3>
        <form className="pdf-to-upload" onSubmit={handlePdf}>
          <label className="pdf-to-upload__label" htmlFor="uploadPDF">
            {pdfToChange}
          </label>
          <input
            className="pdf-to-upload__file"
            type="file"
            name="uploadPDF"
            id="uploadPDF"
            required
            onChange={(e) => setNewPDF(e.target.files[0])}
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
  setUpdatePdfList: PropTypes.any,
  updatePdfList: PropTypes.bool,
};
