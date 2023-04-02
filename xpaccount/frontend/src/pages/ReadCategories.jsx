import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loadCategories, readingAccountService } from "../services";

export const ReadCategories = () => {
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState("");
  const [account, setAccount] = useState({});
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
  }, []);

  return (
    <section className="categories-container">
      <h2>categorías de la cuenta <span>{account.alias}</span></h2>
      <button
            onClick={() => {
              navigate(`/account/${idAccount}`);
            }}
          >
            Volver
          </button>
          <section className="create-category">
            <form className="create-category-form">
              <label htmlFor="newCat"> Crear categoría</label>
              <fieldset>
                <input type="text" name="newCat" id="newCat"/>
                <button>Crear</button>
              </fieldset>
            </form>

          </section>
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
