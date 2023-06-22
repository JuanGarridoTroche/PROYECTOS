import ("../css/family-admin.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFamiliyNamesService } from "../services";
import { Card } from "./Card";

export const Anca = ()=> {
  const {logged, token} = useContext(AuthContext);
  const [selectedIcon, setSelectedIcon] = useState("/file-pdf-regular.svg");
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
  // const [icon, setIcon] = useState(false)
  const url = "anca";

  if(logged?.role === 'user') {
    navigate("/page-not-found");
  }

  useEffect(()=> {
    const checkPdfs = async()=> {
      console.log("useEffect");
      setError("");
      try {
        // Comprobamos que esté logueado            
        if(!token) {
          navigate("/")          
        }
        const ancaPdfs = await getFamiliyNamesService(token, url);
        
        setPdfs(ancaPdfs?.pdf)
      } catch (err) {
        setError(err.message)
      }
    }
    
    if(logged?.role === 'admin') checkPdfs();
  }, [token, logged?.role, navigate])

  // const handleToggle = (pdf)=> {
  //   console.log(icon);
  //   const result = pdfs.map((doc) => {
  //     if(doc === pdf) {
  //       return setIcon(!icon)
  //     }
  //   })
  //   icon ? setSelectedIcon("/file-pdf-regular-white.svg") : setSelectedIcon("/file-pdf-regular.svg");

  //   return selectedIcon;
    
  // }
  
  return (
    <section>
      <h3 className="pdfs-title">Documentos pdf</h3>
      <ul className="pdfs__list">
        {pdfs.map((pdf, index)=> {
          return (
          <li key={index} className="pdfs__item">
            <figure className="pdfs__figure">
              <Card pdf={pdf} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} pdfs={pdfs} id={index}/>
              {/* <img className={icon ? "selected" : null} src={selectedIcon} alt="pdf" onClick={()=> handleToggle(pdf)}/> */}
            </figure>
              <p>
                {pdf}
              </p>
              <button>Actualizar</button>
              <button>Eliminar</button>
          </li>

          )
        })}
      </ul>
      {error ? <p>{error}</p> : null}

    </section>
  )
}