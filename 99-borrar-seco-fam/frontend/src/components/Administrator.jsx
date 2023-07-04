import ("../css/family-admin.css");
import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { deletePdfService, getFamilyDataByUrlService, getFamilyNameAndPdfsService } from "../services";
import { Card } from "./Card";
import { AddPDF } from "./AddPDF";
import { PDF } from "./PDF";

export const Administrator = ()=> {
  const {logged, token} = useContext(AuthContext);
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
  const {url} = useParams();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [addPDF, setAddPDF] = useState(false);

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

  const handleUpdatePDF = async(e)=> {
    e.preventDefault();
    console.log(e.target.name);
    setError("");
    try {
      // alert("modificando el pdf")
    } catch (err) {
      setError(err.message);
    }
  }

  const handleDeletePDF= async(e)=> {   
    e.preventDefault();
    setError("")
    try {
      console.log(url, pdfName);
      const familyData = await getFamilyDataByUrlService(token, url);

      await deletePdfService(token,e.target.name, familyData.lineage);
      navigate(`/familia/administrator`);
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
                <Card key={index} id={index} pdfs={pdfs} setSelectedPdf={setSelectedPdf}/>              
              </figure>
              <p className="pdf__name">
                {pdf}
              </p>
              <div className="pdfs__buttons">
                <button name={pdf} className="pdf--update" onClick={(e)=> {
                  setPdfName(pdf);
                  handleUpdatePDF(e);
                }}>Cambiar</button>
                <button name={pdf} className="pdf--delete" onClick={(e) => {                    
                  handleDeletePDF(e);
                  }}>Eliminar</button>
              </div>
            </li>
            )
          })}
          <li className="pdfs__add-item">
            <AddPDF addPDF={addPDF} setAddPDF={setAddPDF}/>
          </li>
        </ul>
        {error ? <p className="error">{error}</p> : null}
      </section>
      <section className="pdf--selected">
        {addPDF ? <PDF/> :
         (pdfs.length > 0) ? <embed src={`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/static/data/${url}/${selectedPdf || pdfs[0]}`} type="application/pdf" className="pdf__embed"/> : null}
      </section>
    </section>    
  )
}