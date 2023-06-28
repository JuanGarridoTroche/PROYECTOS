/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UploadPDF } from "./UploadPDF";

export const PDF =({familyNames})=> {
  const [error, setError] = useState("");
  const {logged} = useContext(AuthContext);

  return (
    <>
      {logged?.role === 'admin' ? (
          <UploadPDF familyNames={familyNames}/>      
        ) : (
          <embed src={logged?.url && logged?.pdf ? `http://localhost:4000/static/data/${logged?.url}/${logged?.pdf}` : null}
            type="application/pdf" className="selected-pdf"/>
        )

      }
    </>
  )
}