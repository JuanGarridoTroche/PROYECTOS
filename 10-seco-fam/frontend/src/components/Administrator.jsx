import ("../css/family-admin.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { deletePdfService, getFamilyDataByUrlService, getFamilyNameAndPdfsService } from "../services";
import { Card } from "./Card";
import { AddPDF } from "./AddPDF";

export const Administrator = ()=> {
  const {logged, token} = useContext(AuthContext);
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
  const {url} = useParams();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");

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
            
        const urlPdfs = await getFamilyNameAndPdfsService(token, url);
        
        setPdfs(urlPdfs.pdf)     
      } catch (err) {
        setError(err.message)
      }
    }
    
    if(logged?.role === 'admin') checkPdfs();
  }, [token, logged?.role, navigate, url])

  const handleDeletePDF= async()=> {   
    setError("")
    try {
      console.log(url, pdfName);
      const familyData = await getFamilyDataByUrlService(token, url);
      console.log(familyData);
      await deletePdfService(token, pdfName, familyData.lineage);
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
                <Card id={index} pdfs={pdfs} setSelectedPdf={setSelectedPdf}/>              
              </figure>
              <p className="pdf__name">
                {pdf}
              </p>
              <div className="pdfs__buttons">
                <button className="pdf--update" id={index}>Cambiar</button>
                <button className="pdf--delete" onClick={(e) => {
                  e.preventDefault();
                  setPdfName(pdf);
                  handleDeletePDF();
                  }} id={index}>Eliminar</button>
              </div>
            </li>
            )
          })}
          <li className="pdfs__add-item">
            <AddPDF/>
          </li>
        </ul>
        {error ? <p className="error">{error}</p> : null}
      </section>
      <section className="pdf--selected">
        {
         (pdfs.length > 0) ? <embed src={`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/static/data/${url}/${selectedPdf || pdfs[0]}`} type="application/pdf" className="pdf__embed"/> : null}
      </section>
    </section>    
  )
}