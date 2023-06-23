/* eslint-disable react/prop-types */
import { useState } from "react";


export const Card = ({id})=> {
  const [icon, setIcon] = useState(false);

  return(
      <img className={icon ? "selected" : "show-pdf"} alt="pdf" onClick={()=> setIcon(!icon)} key={id}/>    
  )
}