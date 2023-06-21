import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFamiliyNamesService } from "../services";

export const Anca = ()=> {
  const {logged, token} = useContext(AuthContext);
  const [selectedIcon, setSelectedIcon] = useState(false);
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
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

  const handleToggle = (index)=> {
    console.log(index);
    if(pdfs[index]) setSelectedIcon(!selectedIcon);
  }
  
  return (
    <section>
      <h3>Documentos pdf</h3>
      <ul>
        {pdfs.map((pdf, index)=> {
          return (
          <li key={index}>
            <figure>                     
                <img src={selectedIcon ? "/file-pdf-regular-white.svg" : "/file-pdf-regular.svg"} alt="pdf" onClick={()=> handleToggle(index)}/>
              <p>
                {pdf}
              </p>
              <button>Actualizar</button>
              <button>Eliminar</button>
            </figure>
          </li>

          )
        })}
      </ul>
      {error ? <p>{error}</p> : null}

    </section>
  )
}