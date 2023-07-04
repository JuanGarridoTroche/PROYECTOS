import ("../css/UpdateJSON.css");
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { uploadPdfService } from "../services";
import { AuthContext } from "../context/AuthContext";

export const UpdateJSON = ()=> {
  const [error, setError] = useState("");
  const [file, setFile] = useState([]);
  const {token} = useContext(AuthContext);
  const {url} = useParams();




  const handleSubmit = async (e)=> {
    setError("")
    e.preventDefault();
    try {
      console.log('Añadiendo nuevo pdf...');
      
      console.log(file);
      await uploadPdfService(token, file, url)
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="new-pdf">
      <h3 className="new-pdf__title">Nuevo pdf para la familia {url}</h3>
      <form onSubmit={handleSubmit} className="new-pdf__form">
        <fieldset className="new-pdf__fieldset">
          <label htmlFor="uploadPDF" className="new-pdf__label">Nuevo pdf</label>
          <input type="file" name="uploadPDF" id="uploadPDF" className="new-pdf__file" placeholder="Introduce un nuevo pdf..." onChange={(e)=> {setFile(e.target.files[0])}}/>
        </fieldset>
        <button className="new-pdf__button">Enviar</button>
      </form>
    </section>
  )
}