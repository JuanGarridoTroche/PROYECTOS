import ("../css/family-admin.css");
import { useState } from "react";
import {PDF} from "./PDF";

export const AddPDF = ()=> {
  const [selectedIcon, setSelectedIcon] = useState(false);
  return (
    <>
      <img className={selectedIcon ? "selected-add-pdf" : "add-pdf"} alt="addPDF" onClick={()=> setSelectedIcon(!selectedIcon)}/> 
      {selectedIcon ? <PDF/> : null}
    </>
         
  )
}