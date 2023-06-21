import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

/* eslint-disable react/prop-types */
export const UploadPDF = ({familyNames})=> {
  const [error, setError] = useState("");
  const {logged} = useContext(AuthContext);
  const [pdf, setPdf] = useState();
  let uploadPDF= [logged?.pdf];

  const handleUploadPDF = async(e)=> {
    e.preventDefault();
    setError("");
    try {
      uploadPDF = [...uploadPDF, pdf]
      console.log("uploadPDF: ", uploadPDF);

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="admin__form" onSubmit={handleUploadPDF}>
      <select name="families" id="families" className="admin__select">
        <option value="">Elige familia...</option>
        {familyNames.map((family)=> {
          return (<option value={family.lineage} key={family.id}>
            {family.lineage}
          </option>)
        })}
      </select>
      <label htmlFor="uploadPDF"> Subir pdf</label>
      <input name="uploadPDF" id="uploadPDF" type="file" formEncType="multipart/form-data" multiple={false} accept="application/pdf,application/vnd.ms-excel" onChange={(e)=> {setPdf(e.target.files[0])}}/>
      <button>Enviar</button>
    </form>
  )
}