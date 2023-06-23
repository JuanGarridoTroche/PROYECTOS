/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UploadPDF } from "./UploadPDF";

export const PDF =({familyNames})=> {
  const [error, setError] = useState("");
  const {logged} = useContext(AuthContext);
  const [pdf, setPdf] = useState();
  let uploadPDF= [logged?.pdf];

  // const handleUploadPDF = async(e)=> {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     uploadPDF = [...uploadPDF, pdf]
  //     console.log("uploadPDF: ", uploadPDF);

  //   } catch (err) {
  //     setError(err.message);
  //   }
  // }

  return (
    <>
      {logged?.role === 'admin' ? (
          <UploadPDF familyNames={familyNames}/>      
        ) : (
          // <iframe                
          //   src={logged?.url && logged?.pdf ? `http://localhost:4000/static/data/${logged?.url}/${logged?.pdf}` : null}
          //   className="selected-pdf"                        
          //   >Tu navegador no soporta iframe
          // </iframe>
          <embed src={logged?.url && logged?.pdf ? `http://localhost:4000/static/data/${logged?.url}/${logged?.pdf}` : null}
            type="application/pdf" className="selected-pdf"/>
        )

      }
    </>
  )
}