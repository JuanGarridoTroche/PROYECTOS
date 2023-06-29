import ("../css/family-admin.css");
import { useState } from "react";
import {PDF} from "./PDF";
import { useNavigate, useParams } from "react-router-dom";

export const AddPDF = ()=> {
  const [selectedIcon, setSelectedIcon] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {url} = useParams();

  const handleAddPDF = async(e)=> {
    e.preventDefault()
    setError("");
    try {
      // setSelectedIcon(!selectedIcon)
      // console.log(url);
      // setAddPDF(!addPDF)
      navigate(`/familia/administrator/addPDF/${url}`)  
    } catch (err) {
      setError(err.message);
    }

  }

  return (
    <>
      <img className={selectedIcon ? "selected-add-pdf" : "add-pdf"} alt="addPDF" onClick={handleAddPDF }/> 
      {selectedIcon ? <PDF/> : null}
    </>
         
  )
}