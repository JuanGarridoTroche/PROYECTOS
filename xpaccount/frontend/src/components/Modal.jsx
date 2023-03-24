import { useNavigate } from "react-router-dom";

import("../css/Modal.css");
export const Modal = ({ setShowModal, children }) => {
  const navigate = useNavigate();

  return (
    <section>
      <h2>Esto es un modal</h2>
      <div
        className="modalBg"
        onClick={(e) => {
          e.preventDefault();
          setShowModal(false);
        }}
      >
        <div
          className="modalContainer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {children}
          <button
            onClick={(e) => {
              setShowModal(false);
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </section>
  );
};
