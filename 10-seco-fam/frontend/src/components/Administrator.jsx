import ("../css/family-admin.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getFamiliyNamesService } from "../services";
import { Card } from "./Card";
import { AddPDF } from "./AddPDF";

export const Administrator = ()=> {
  const {logged, token} = useContext(AuthContext);
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
  const {url} = useParams();

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
        
        const urlPdfs = await getFamiliyNamesService(token, url);
        
        setPdfs(urlPdfs?.pdf)        
      } catch (err) {
        setError(err.message)
      }
    }
    
    if(logged?.role === 'admin') checkPdfs();
  }, [token, logged?.role, navigate, url])

  const handleDelete= async(e)=> {
    e.preventDefault();
    setError("")
    try {
      console.log("Eliminar fichero físico y del json");
    } catch (err) {
      setError(err.message);
    }
  }
   
  return (
    <section className="admin-container">
      <section className="pdfs">
        <h3 className="pdfs__title">Documentos pdf</h3>
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
              <div className="pdfs__buttons">
                <button className="pdf--update">Cambiar</button>
                <button className="pdf--delete" onClick={handleDelete}>Eliminar</button>
              </div>
            </li>
            )
          })}
          <li className="pdfs__add-item">
            <AddPDF/>
          </li>
        </ul>
        {error ? <p>{error}</p> : null}
      </section>
      <section className="pdf--selected">
        <embed src={`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/static/data/${url}/${pdfs[0]}`} type="application/pdf" className="pdf__embed"/>
      </section>
    </section>    
  )
}