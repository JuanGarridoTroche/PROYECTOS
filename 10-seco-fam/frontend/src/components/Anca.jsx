import ("../css/family-admin.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFamiliyNamesService } from "../services";
import { Card } from "./Card";
import { AddPDF } from "./AddPDF";

export const Anca = ()=> {
  const {logged, token} = useContext(AuthContext);
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
  
  return (
      <section>
        <section className="pdfs">
          <h3 className="pdfs-title">Documentos pdf</h3>
          <ul className="pdfs__list">
            {pdfs.map((pdf, index)=> {
              return (
              <li key={index} className="pdfs__item">
                <figure className="pdfs__figure">
                  <Card id={index}/>              
                </figure>
                  <p className="pdf__name">
                    {pdf}
                  </p>
                  <button className="pdf--update">Actualizar</button>
                  <button className="pdf--delete">Eliminar</button>
              </li>
              )
            })}
            <li>
              <AddPDF/>
            </li>
          </ul>
          {error ? <p>{error}</p> : null}
        </section>
        <section>
          <embed src="/static/data/anca/Anca.pdf" type="application/pdf" />
        </section>

      </section>    
  )
}