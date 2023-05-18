import ('../../css/Modal.css');
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
export const Modal = ({title, children, setShowModal, page}) => {
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
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
              if(page === "RegisterPage"){ navigate("/login")};
              if(page === "updatePasswordPage"){logout(); navigate("/login")};
              if(page === "ValidateUserPage"){logout(); navigate("/login")};
              if(page=== "RecoverPasswordSolicitudePage") {logout(); navigate("/login")};
            }}
          >
            Informado
          </button>
        </div>
      </div>
  </section>
  );
};


