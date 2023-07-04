/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export const PDF =({familyNames})=> {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {logged} = useContext(AuthContext);
  const {url} = useParams();

  return (
    <>
      {logged?.role === 'admin' ? (
          // <AddPDF familyNames={familyNames}/>
          navigate(`/familia/administrator/addPDF/${url}`)  
        ) : (
          <embed src={logged?.url && logged?.pdf ? `http://localhost:4000/static/data/${logged?.url}/${logged?.pdf}` : null}
            type="application/pdf" className="selected-pdf"/>
        )

      }
    </>
  )
}