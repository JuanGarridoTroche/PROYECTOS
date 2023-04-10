import { useContext, useEffect, useState } from "react"
import { deleteEntryService, loadCategories, loadSubcategoriesService, updateEntryService } from "../services";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Entries = ({entry, setRecoverEntries, recoverEntries})=> {
  const [idEntry, setIdEntry] = useState(0);
  const {token} = useContext(AuthContext);
  const [dateEntry, setDateEntry] = useState(entry.dateEntry)
  const [category, setCategory] = useState(entry.category);
  const [subcategory, setSubcategory] = useState(entry.subcategory);
  const [amount, setAmount] = useState(entry.amount);
  const [concept, setConcept] = useState(entry.concept);
  const [comment, setComment] = useState(entry.comment);
  const [error, setError] = useState("");
  const {idAccount} = useParams();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

 const handleLoadCategories = async (e)=>{
   e.preventDefault();
   setError("");
   console.log("Entré");
  try {
    console.log("Entré");
    //Conseguir todas las categorías de la cuenta idAccount
    const myCategories = await loadCategories(token, idAccount);
    setCategories(myCategories);
    console.log(myCategories);
  } catch (err) {
    setError(err.message);
  }
}

  // Manejador que carga las subcategorías de la category seleccionada
  const handleSubcategories = async (selectedCat) => {
    setError("");
    try {

      if(selectedCat !== "Elige una opción...") {
        const idCategory = categories.find(
          (element) => element.name === selectedCat
        ).id;
  
        if (idCategory) {
          const mySubcategories = await loadSubcategoriesService(token, idCategory);
          setSubcategories(mySubcategories);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  
  const handleUpdateEntry = async(e)=> {
    e.preventDefault();    
    setError("")
    try {
      const data = {category, subcategory, amount, concept, comment };      
      await updateEntryService({token, idAccount, idEntry, data});
      setRecoverEntries(!recoverEntries);
      setIdEntry(0);
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteEntry = async(e)=> {
    e.preventDefault();
    setError("")
    try {
      if(window.confirm("¿Estás seguro de que quieres eliminar este asiento bancario?")){
      await deleteEntryService({token, idAccount, idEntry})
        setRecoverEntries(!recoverEntries)
      }
      setIdEntry(0)      
    } catch (err) {
      setError(err.message)
    }
  }
  

  return (
    <>
      {entry.id !== idEntry ?
      <tr>        
        <td className="updt-date">{entry.dateEntry}</td>
        <td className="updt-cat">{entry.category}</td>
        <td className="updt-subcat">{entry.subcategory}</td>
        <td className={parseFloat(entry.amount) > 0 ? "numbers" : "numbers negative"}>
          {parseFloat(entry.amount).toFixed(2)} EUR
        </td>
        <td className={parseFloat(entry.balance) > 0 ? "numbers" : "numbers negative"}>
            {parseFloat(entry.balance).toFixed(2)} EUR
        </td>
        
        <td className="concept">{entry.concept}</td>
        <td className="comment">{entry.comment}</td>
        <td>
        <button className="update" onClick={() => {
          handleLoadCategories;
          setIdEntry(entry.id)
          setRecoverEntries(!recoverEntries)
          }}
        >
          Editar
        </button>
        </td>
      </tr> 
      :        
      <tr>  
        <td className="updt-date"><input type="text" name="dateEntry" id="dateEntry" value={dateEntry} onChange={(e)=> {setDateEntry(e.target.value)}} key={entry.id}/></td>
        <td className="updt-cat">
          <select
              name="categories"
              onClick={(e) => {
                setCategory(e.target.value);
                handleSubcategories(e.target.value);
              }}
            >
              <option defaultValue>{entry.category}</option>
              {entry.category &&
                categories.map((category) => {
                  return <option key={category.id}>{category.name}</option>;
                })}
            </select></td>
        <td className="updt-subcat"><input type="text" name="subcategory" id="subcategory" value={subcategory} onChange={(e)=>{setSubcategory(e.target.value)}} /></td>
        <td className="updt-amount"><input type="number" name="amount" id="amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/></td>        
        <td className={parseFloat(entry.balance) > 0 ? "numbers" : "numbers negative"}>
            {parseFloat(entry.balance).toFixed(2)} EUR
        </td> 

        <td className="concept"><input type="text" name="concept" id="concept" value={concept} onChange={(e)=>{setConcept(e.target.value)}} /></td>
        <td className="comment"><input type="text" name="comment" id="comment" value={comment} onChange={(e)=>{setComment(e.target.value)}} /></td>
        <td>
        <button className="updating" onClick={handleUpdateEntry}>
          A
        </button>
        <button className="deleting" onClick={handleDeleteEntry}>
          E
        </button>
        <button className="canceling" onClick={()=> setIdEntry(0)}>
          {'<<'}
        </button>
        </td>
      </tr>      
      }
    </>
  )
}