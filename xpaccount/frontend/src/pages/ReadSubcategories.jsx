import("../css/ReadCategories.css");
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createSubcategoryService, getCategoryDataService, loadSubcategoriesService, updateCategoryService } from "../services";
import { Modal } from "../components/Modal";
import { ModalUpdateSubCat } from "../components/ModalUpdateSubCat";

export const ReadSubcategories = () => {
  const { idAccount, idCategory } = useParams();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdateSubCat, setShowModalUpdateSubCat] = useState(false);
  const [category, setCategory] = useState({});
  const [subcategories, setSubcategories] = useState("");
  const [updateCat, setUpdateCat] =useState("");
  const [updateCommentCat, setUpdateCommentCat] = useState("");
  const [newSubcat, setNewSubcat] = useState("")
  const [updateNameSubcat, setUpdateNameSubcat] = useState("");
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState("");
  const navigate = useNavigate();
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

  const handleHTMLTagSubcategory = async()=> {    
    setError("");
    try {
      setReload(!reload);    
      console.log(idSubcat);
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
                  {/* <Link to={`/account/${idAccount}/category/${subcategory.idCat}/subcategory/${subcategory.id}`} onClick={()=>{setShowModal(true)}}>
                    {subcategory.name}
                  </Link> */}
                  {subcategory.id !== idSubcat ?
                  <a href="#" id={subcategory.id} onClick={(e) => {
                    setIdSubcat(subcategory.id);
                    handleHTMLTagSubcategory(subcategory.id)}}>{subcategory.name}</a> : 
                  <form>
                    <input value={subcategory.name} onChange={(e) => {setUpdateNameSubcat(e.target.value)}}/>
                    <button>Actualizar</button>
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
      {showModalUpdateSubCat && (
        <ModalUpdateSubCat setShowModalUpdateSubCat={setShowModalUpdateSubCat} subcategories={subcategories} selectedSub={selectedSub}/>
      )
      }

    </section>
  );
};
