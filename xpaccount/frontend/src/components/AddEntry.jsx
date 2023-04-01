import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadCategories, loadSubcategories } from "../services";
import { AuthContext } from "../context/AuthContext";

export const AddEntry = () => {
  const [error, setError] = useState("");
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  let selectedCat = "";


  // Obtenemos las categorías de la cuenta con idAccount
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

  // Manejador que carga las subcategorías de la category seleccionada
  const handleSubcategories = async(selectedCat)=>{
    setError("");
    try {
      const idCategory = categories.find(element => element.name === selectedCat).id;
      
      if(idCategory) {
        const mySubcategories = await loadSubcategories(token, idCategory);
        setSubcategories(mySubcategories);
      }      
     
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <table>
      <tbody className="tbody-new-entry">
        <tr>
          <td>
            <input
              type="date"
              onChange={(e) => {
                e.target.value;
              }}
            />
          </td>
          <td>
            <select name="categories" onClick={(e)=>{
              handleSubcategories(e.target.value);
            }}>
              <option defaultValue>Elige una opción...</option>
              {categories && categories.map((category) => {
                return (
                  <option key={category.id}>{category.name}</option>
                )
              })}
            </select>
          </td>
          <td>
            <select name="subcategories">
              <option defaultValue>Elige una opción...</option>
              {subcategories && subcategories.map((subcategory) => {
                return(
                <option key={subcategory.id}>{subcategory.name}</option>
              )})}
            </select>
          </td>
          <td>
            <input type="text" />
          </td>
          <td>
            <input type="text" disabled />
          </td>
          <td>
            <input type="text" />
          </td>
          <td>
            <input type="text" />
          </td>
          <td>
            <button>Añadir</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
