import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loadCategories } from "../services";

export const ReadCategories = () => {
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    const loadMyCategories = async () => {
      setError("");
      try {
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
      <h2>categorías de la cuenta </h2>
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
