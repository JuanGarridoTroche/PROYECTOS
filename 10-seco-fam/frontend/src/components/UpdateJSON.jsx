import { useState } from "react";
import { updateJSONService } from "../services";

export const UpdateJSON = ()=> {
  const [error, setError] = useState("");
  const [pdf, setPdf] = useState([]);
  const [logo, setLogo] = useState([]);

  const handleSubmit = async (e)=> {
    setError("")
    e.preventDefault();
    try {
      console.log('probando modificación de JSON');
      let newEntry = {}
      const updatingFiles = await updateJSONService(token, pdf, logo);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h3>Actualizando JSON</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="pdf">Nuevo pdf</label>
          <input type="file" name="pdf" id="pdf" className="form-control" placeholder="Introduce un nuevo pdf..." />
        </fieldset>
        {/* <fieldset>
          <label htmlFor="logo">Logo</label>
          <input type="file"  name="logo" id="logo" className="form-control" placeholder="Introduce un nuevo logo..." />
        </fieldset> */}
        <button>Enviar</button>
      </form>
    </section>
  )
}