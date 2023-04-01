import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddEntryService,
  loadCategories,
  loadSubcategories,
} from "../services";
import { AuthContext } from "../context/AuthContext";
import { TableHead } from "./TableHead";

export const AddEntry = ({ entries }) => {
  const [error, setError] = useState("");
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  let selectedCat = "";

  const [dateEntry, setDateEntry] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [concept, setConcept] = useState("");
  const [comment, setComment] = useState("");

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
  const handleSubcategories = async (selectedCat) => {
    setError("");
    try {
      const idCategory = categories.find(
        (element) => element.name === selectedCat
      ).id;

      if (idCategory) {
        const mySubcategories = await loadSubcategories(token, idCategory);
        setSubcategories(mySubcategories);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Maneja añadir un asiento bancario
  const handleAddEntry = async () => {
    setError("");
    try {
      const data = {
        dateEntry,
        category,
        subcategory,
        amount,
        concept,
        comment,
      };
      
      await AddEntryService(token, idAccount, data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {entries.length < 1 ? <TableHead /> : null}
      <tbody className="tbody-new-entry">
        <tr>
          <td>
            <input
              type="date"
              onChange={(e) => {
                setDateEntry(e.target.value);
              }}
            />
          </td>
          <td>
            <select
              name="categories"
              onClick={(e) => {
                setCategory(e.target.value);
                handleSubcategories(e.target.value);
              }}
            >
              <option defaultValue>Elige una opción...</option>
              {categories &&
                categories.map((category) => {
                  return <option key={category.id}>{category.name}</option>;
                })}
            </select>
          </td>
          <td>
            <select
              name="subcategories"
              onChange={(e) => {
                setSubcategory(e.target.value);
              }}
            >
              <option defaultValue>Elige una opción...</option>
              {subcategories &&
                subcategories.map((subcategory) => {
                  return (
                    <option key={subcategory.id}>{subcategory.name}</option>
                  );
                })}
            </select>
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </td>
          <td>
            <input type="text" disabled />
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => {
                setConcept(e.target.value);
              }}
            />
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </td>
          <td>
            <button onClick={handleAddEntry}>Añadir</button>
          </td>
        </tr>
      </tbody>
    </>
  );
};
