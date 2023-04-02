import("../css/Modal.css");
import { useNavigate, useParams } from "react-router-dom";

export const ModalUpdateSubCat = ({
  setShowModalUpdateSubCat,
  subcategories,
  idSubcat,
}) => {
  const navigate = useNavigate();
  const {idAccount, idCategory} = useParams();



  return (
    <section>
      <h2>Esto es un modal</h2>
      <div className="modalBg" onClick={(e) => {
          e.preventDefault();
          setShowModalUpdateSubCat(false);
        }}
      >
        <div
          className="modalContainer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        > {idAccount}  {idCategory} {idSubcat}
          <button
            onClick={(e) => {
              setShowModalUpdateSubCat(false);
              navigate("/");
            }}
          >
            Ir a Inicio
          </button>
        </div>
      </div>
    </section>
  );
};
