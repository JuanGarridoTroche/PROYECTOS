import { useState } from "react";
import { useParams } from "react-router-dom";

export const UpdateJSON = ()=> {
  const [error, setError] = useState("");
  const {url} = useParams();

  const handleSubmit = async (e)=> {
    setError("")
    e.preventDefault();
    try {
      console.log('Añadiendo nuevo pdf...');
      let newEntry = {}
      // const updatingFiles = await updateJSONService(token, pdf, logo);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h3>Subir nuevo pdf para la familia {url}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="pdf">Nuevo pdf</label>
          <input type="file" name="pdf" id="pdf" className="form-control" placeholder="Introduce un nuevo pdf..." />
        </fieldset>
        <button>Enviar</button>
      </form>
    </section>
  )
}