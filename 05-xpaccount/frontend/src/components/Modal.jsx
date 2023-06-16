import("../css/Modal.css");
import { useNavigate } from "react-router-dom";

export const Modal = ({setShowModal, children }) => {
  const navigate = useNavigate();

  return (
    <section>
      <h2>Modal</h2>
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
              // navigate("/")
            }}
          >
            Informado
          </button>
        </div>
      </div>
  </section>
  );
};
