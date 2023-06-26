/* eslint-disable react/prop-types */
import { useState } from "react";


export const Card = ({id})=> {
  const [icon, setIcon] = useState(false);

  const handlePDF = (id)=> {
    setIcon(!icon);
    
    if(!icon) {
      console.log(icon);
      console.log("Mostrar PDF");
    }
  }

  return(
      <img className={icon ? "selected" : "show-pdf"} alt="pdf" onClick={handlePDF} key={id}/>    
  )
}