import ("../css/family-admin.css");
import { useEffect, useState } from "react";
import {PDF} from "./PDF";
import { useNavigate, useParams } from "react-router-dom";
import { getAllFamiliyNamesService } from "../services";

export const AddPDF = ()=> {
  const [selectedIcon, setSelectedIcon] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {url} = useParams();

  const handleAddPDF = async(e)=> {
    e.preventDefault()
    setError("");
    try {
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