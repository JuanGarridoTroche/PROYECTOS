import("../css/Modal.css");
import { useNavigate } from "react-router-dom";

export const Modal = ({title, setShowModal, children }) => {
  const navigate = useNavigate();

  return (
    <section>
      <h2>{title}</h2>
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
          {title}
          {children}
          <button
            onClick={(e) => {
              setShowModal(false);
              // navigate("/")
            }}
          >
            Ok
          </button>
        </div>
      </div>
  </section>
  );
};
