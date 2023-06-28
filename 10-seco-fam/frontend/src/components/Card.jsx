/* eslint-disable react/prop-types */
import { useState } from "react";


export const Card = ({id, pdfs, setSelectedPdf})=> {
  const [icon, setIcon] = useState(false);

  const handlePDF = (id)=> {
    pdfs.map((pdf, index)=> {
      setIcon(false);     
    })
    setSelectedPdf(pdfs[id]);
    
    
  }

  return(
      <img className={icon ? "selected" : "show-pdf"} alt="pdf" onClick={()=> handlePDF(id)} key={id}/>    
  )
}