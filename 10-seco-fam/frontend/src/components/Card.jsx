/* eslint-disable react/prop-types */
import { useState } from "react";


export const Card = ({pdf, selectedIcon, setSelectedIcon, pdfs, id})=> {
  const [icon, setIcon] = useState(false);
  const [index, setIndex] = useState(0);

  const handleClick = (e)=> {   
    setIndex(0);  
    e.preventDefault();
    const result = pdfs.filter((doc) => {      
      if(doc === pdf) {
        setIcon(!icon)
        icon ? setSelectedIcon("/file-pdf-regular-white.svg") : setSelectedIcon("/file-pdf-regular.svg");
        return setIndex(index);
      } 
      setIndex(index + 1);
      console.log(icon);
    });    
    
    
    
      return result;    
  }

  return(
    <>
      <img className={icon && index === id ? "selected" : null} src={selectedIcon} alt="pdf" onClick={handleClick} key={id}/>
      {index}
    </>
  )
}