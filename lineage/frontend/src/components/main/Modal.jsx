import ('../../css/Modal.css');
import { useNavigate } from "react-router-dom";
export const Modal = ({title, children, setShowModal, page}) => {
  const navigate = useNavigate();
  // console.log("Título: ", title);
  // console.log("Children: ", children);
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
          <h2>{title}</h2>
          {children}
          <button
            onClick={() => {
              setShowModal(false);
              page === "RegisterPage" ? navigate("/login") : null;
            }}
          >
            Informado
          </button>
        </div>
      </div>
  </section>
  );
};


