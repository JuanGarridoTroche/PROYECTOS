import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createCategoryService, loadCategories, readingAccountService } from "../services";

export const ReadCategories = () => {
  const { idAccount} = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState("");
  const [account, setAccount] = useState({});
  const [newCat, setNewCat] = useState("");
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadMyCategories = async () => {
      setError("");   

      try {
        // Recuperar los datos de la cuenta
        const myAccount = await readingAccountService({ idAccount, token });
        setAccount(myAccount);

        //Conseguir todas las categorías de la cuenta idAccount
        const myCategories = await loadCategories(token, idAccount);        
        setCategories(myCategories);
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) {
      loadMyCategories();
    }
  }, [reload]);

  const handleCreateCategory = async (e)=> {
    e.preventDefault();
    setError("")
    try {
      const data = {category: newCat, comment};
      await createCategoryService(token, idAccount, data); 
      setNewCat("");
      setComment("");    
      setReload(!reload);
    } catch (err) {
      setError(err.message);
    }
  }  

  return (
    <section className="categories-container">
      <h2>Cuenta <span>{account.alias}</span></h2>
      <button
        onClick={() => {
          navigate(`/account/${idAccount}`);
        }}
        >
        Volver
      </button>
      <section className="create-category">
        <form className="create-category-form" onSubmit={handleCreateCategory}>
          <label htmlFor="newCat"> Crear categoría</label>
          <fieldset>
            <input type="text" name="newCat" id="newCat" placeholder="nombre" value={newCat} onChange={(e) => {
              setNewCat(e.target.value);
            }}/>
            <input type="text" name="comment" id="comment" placeholder="comentario" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
            <button>Crear</button>
          </fieldset>
        </form>
      </section>

      <h2>categorías de <span>{account.alias}</span></h2>
      {error ? <label className="error">{error}</label> : null}
      <section className="categories-content">
        <ul>
          {categories &&
            categories.map((category) => {
              return (
                <li key={category.id}>
                  <Link to={`/account/${idAccount}/category/${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>
    </section>
  );
};
