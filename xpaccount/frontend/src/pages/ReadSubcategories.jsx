import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createSubcategoryService, loadSubcategories } from "../services";

export const ReadSubcategories = () => {
  const { idAccount, idCategory } = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [newSubcat, setNewSubcat] = useState("")
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState("");
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
  }, [reload]);

  const handleCreateSubcategory = async (e)=> {
    e.preventDefault();
    setError("")
    try {
      const data = {nameSubcat: newSubcat, comment};
      await createSubcategoryService(token, idCategory, data); 
      setNewSubcat("");
      setComment("");    
      setReload(!reload);
    } catch (err) {
      setError(err.message);
    }

  }

  return (
    <section className="categories-container">
      <h2>Subcategorías de la cuenta</h2>
      {error ? <label className="error">{error}</label> : null}
      <button
            onClick={() => {
              navigate(`/account/${idAccount}/categories`);
            }}
          >
            Volver
      </button>
      <section className="create-category">
            <form className="create-category-form" onSubmit={handleCreateSubcategory}>
              <label htmlFor="newSubcat"> Crear categoría</label>
              <fieldset>
                <input type="text" name="newSubcat" id="newSubcat" placeholder="nombre subcategoría" value={newSubcat} onChange={(e) => {
                  setNewSubcat(e.target.value);
                }}/>
                <input type="text" name="comment" id="comment" placeholder="comentario" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
                <button>Crear</button>
              </fieldset>
            </form>
      </section>
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
