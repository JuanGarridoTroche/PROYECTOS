import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loadSubcategories } from "../services";

export const ReadSubcategories = () => {
  const { idAccount, idCategory } = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const navigate = useNavigate();

  

  useEffect(() => {
    const loadMySubcategories = async () => {
      setError("");
      try {
        //Conseguir todas las categorías de la cuenta idCategory
        const mySubcategories = await loadSubcategories(token, idCategory);
        setSubcategories(mySubcategories);
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) {
      loadMySubcategories();
    }
  }, []);

  return (
    <section className="categories-container">
      <h2>Subcategorías de la cuenta</h2>
      <button
            onClick={() => {
              navigate(`/account/${idAccount}/categories`);
            }}
          >
            Volver
          </button>
      <section className="categories-content">
        <ul>
          {subcategories &&
            subcategories.map((subcategory) => {
              return (
                <li key={subcategory.id}>
                  <Link to={`/account/${idAccount}/category/${subcategory.idCat}/subcategory/${subcategory.id}`}>
                    {subcategory.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>
    </section>
  );
};
