import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    <>
      <h2>Ver todas las categorías creadas de la cuenta</h2>
      {categories && categories.map((category) => {
        return (
          <p key={category.id}>{category.name}</p>
        )
      })
      }
    </>
  );
};
