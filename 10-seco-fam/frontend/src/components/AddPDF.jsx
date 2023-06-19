/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const AddPDF =({familyNames})=> {

  const {logged} = useContext(AuthContext);

  return (
    <>
      {logged?.role === 'admin' ? (
        <form className="admin__form">
          <select name="families" id="families" className="admin__select">
            <option value="">Elige familia...</option>
            {familyNames.map((family)=> {
              return (<option value={family.lineage} key={family.id}>
                {family.lineage}
              </option>)
            })}
          </select>
          <label htmlFor="uploadPDF"> Subir pdf</label>
          <input name="uploadPDF" id="uploadPDF" type="file" formEncType="multipart/form-data" multiple={false} accept="application/pdf,application/vnd.ms-excel"/>
          <button>Enviar</button>
        </form>
      
        ) : (
        <iframe                
          src={`http://localhost:4000/static/data/${logged?.url}/${logged?.pdf}`}
          >Tu navegador no soporta iframe
        </iframe>
      )

      }
    </>
  )
}