import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createSubcategoryService, deleteSubcategoryService, getCategoryDataService, loadSubcategoriesService, updateCategoryService, updateSubcategoryService } from "../services";
import { Modal } from "../components/Modal";

export const ReadSubcategories = () => {
  const { idAccount, idCategory } = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState({});
  const [subcategories, setSubcategories] = useState("");
  const [updateCat, setUpdateCat] =useState("");
  const [updateCommentCat, setUpdateCommentCat] = useState("");
  const [newSubcat, setNewSubcat] = useState("")
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState("");
  const navigate = useNavigate();
  const [updateNameSubcat, setUpdateNameSubcat] = useState("");  
  const [idSubcat, setIdSubcat] = useState(0);

  

  useEffect(() => {
    const loadMySubcategories = async () => {
      setError("");
      try {
        // Recuperar los datos de la idCategory
        const MyCategory = await getCategoryDataService(token, idAccount, idCategory);
        setCategory(MyCategory);
        setUpdateCat(MyCategory.name);
        setUpdateCommentCat(MyCategory.comment);

        //Conseguir todas las categorías de la cuenta idCategory
        const mySubcategories = await loadSubcategoriesService(token, idCategory);
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

  // Manejador de actualización de la categoría
  const handleUpdateCategory = async(e)=> {
    e.preventDefault();
    setError("");
    try {
      const data = {category: updateCat, comment: updateCommentCat};
      
      await updateCategoryService({token, idAccount, idCategory, data});
      setReload(!reload);
      setShowModal(true);
    } catch (err) {
      setError(err.message)
    }
  }

  // Manejador de la actualización de la subcategoría
  const handleUpdateSubcategory = async(e)=> {
    e.preventDefault();
    setError("");

    try {      
      const data = {nameSubcat: updateNameSubcat, comment:""};
      await updateSubcategoryService({token, idCategory, idSubcat, data});
      setIdSubcat(0);
      setReload(!reload);    
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteSubcategory = async(e) => {
    e.preventDefault();
    setError("");
    try {
      console.log(idSubcat);
      // alert("Subcategoría eliminada")
      await deleteSubcategoryService({idCategory, idSubcat, token});
      setIdSubcat(0);
      setReload(!reload);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="categories-container">
      <h2>Categoría <span>{category.name}</span></h2>
      {error ? <label className="error">{error}</label> : null}
      <button
            onClick={() => {
              navigate(`/account/${idAccount}/categories`);
            }}
          >
            Volver
      </button>
      <section className="create-category update">
            <form className="create-category-form" onSubmit={handleUpdateCategory}>
              <label htmlFor="cat"> Modificar categoría</label>
              <fieldset>
                <input type="text" name="category" id="category" placeholder="nombre categoría" value={updateCat} onChange={(e) => {
                  setUpdateCat(e.target.value);
                }}/>
                <input type="text" name="commentCat" id="commentCat" placeholder="comentario" value={updateCommentCat} onChange={(e)=>{setUpdateCommentCat(e.target.value)}}/>
                <button>Actualizar</button>
              </fieldset>
            </form>
      </section>
      <section className="create-category subcategory">
        <form className="create-category-form" onSubmit={handleCreateSubcategory}>
          <label htmlFor="newSubcat"> Crear subcategoría</label>
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
        <h2>Subcategorías de <span>{category.name}</span></h2>
        <ul>
          {subcategories &&
            subcategories.map((subcategory) => {
              return (                
                <li key={subcategory.id}>
                  {subcategory.id !== idSubcat ?
                  <a href="#" id={subcategory.id} onClick={(e) => {
                    setIdSubcat(subcategory.id)
                    setUpdateNameSubcat(subcategory.name)  
                  }}>{subcategory.name}</a> : 
                  <form onSubmit={handleUpdateSubcategory}>
                    <input type="text" name="nameSubcat" value={updateNameSubcat} id={subcategory.id} onChange={(e) => {                      
                      setUpdateNameSubcat(e.target.value)
                      }}/>
                    <button className="updating">Actualizar</button>
                    <button className="canceling" onClick={()=>{setIdSubcat}}>{'<<'}</button>
                    <button className="deleting" onClick={handleDeleteSubcategory}>
                      Eliminar
                  </button>
                  </form>
                  
                  }
                </li>
              );
            })}
        </ul>
      </section>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          Categoría actualizada!
        </Modal>
      )}

    </section>
  );
};
