import ("../css/UpdateJSON.css");
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UpdateJSON = ()=> {
  const [error, setError] = useState("");
  const [file, setFile] = useState();
  const {url} = useParams();




  const handleSubmit = async (e)=> {
    setError("")
    e.preventDefault();
    try {
      console.log('Añadiendo nuevo pdf...');
      let newEntry = {}
      console.log(file);
      await uploadPdfService(token, url)
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
          <input type="file" name="uploadPDF" id="uploadPDF" className="new-pdf__file" placeholder="Introduce un nuevo pdf..." onChange={(e)=> {setFile(e.target.value)}}/>
        </fieldset>
        <button className="new-pdf__button">Enviar</button>
      </form>
    </section>
  )
}