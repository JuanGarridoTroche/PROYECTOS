import("../css/Modal.css");
import { useNavigate, useParams } from "react-router-dom";

export const ModalUpdateSubCat = ({
  setShowModalUpdateSubCat,
  subcategories,
  selectedSub,
}) => {
  const navigate = useNavigate();
  const {idAccount, idCategory} = useParams();

console.log(selectedSub.id);

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
        > {idAccount}  {idCategory}
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
