import "../css/Modal.css";
import PropTypes from 'prop-types';

// Pinta un modal blanco con un fondo oscuro. El contenido del modal es lo recibido en la prop children. También recibe setShowModal para poder cerrar el modal cuando hagamos click en el fondo oscuro
const Modal = ({ children, setShowModal }) => {
  
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
          e.preventDefault();

          // Cuando hacemos click en el contenido del modal (lo blanco), cancelamos la propagación para que no se active el onClick del fondo del modal (lo oscuro)
          e.stopPropagation();
        }}
      >
        {children}
        <div className="close" onClick={(e)=>{
          e.preventDefault();          
          setShowModal(false);
          }}>X</div>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.any,
  setShowModal: PropTypes.any,
}