import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Diaz = ()=> {
  const {logged} = useContext(AuthContext);
  const [selectedIcon, setSelectedIcon] = useState(false);
  const navigate = useNavigate();
  if(logged?.role === 'user') {
    navigate("/page-not-found");
  }

  const handleToggle = ()=> {    
    setSelectedIcon(!selectedIcon);
    
  }
  
  return (
    <section>
      <h3>Documentos pdf</h3>
      <article>
        <figure>
        <img src={selectedIcon ? "/file-pdf-regular-white.svg" : "/file-pdf-regular.svg"} alt="pdf" onClick={handleToggle}/>
        </figure>
        <section>
          Familia Díaz
        </section>
      </article>
    </section>
  )
}