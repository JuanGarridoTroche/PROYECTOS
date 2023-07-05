import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllFamiliyNamesService } from "../services";
import { useNavigate, useParams } from "react-router-dom";
import { PDF } from "../components/PDF";
import ("../css/Family.css")

export const Family = ()=> {
  const {token, logged} = useContext(AuthContext);
  const navigate = useNavigate();
  const {url} = useParams();
  const [error, setError] = useState("");
  const [familyNames, setFamilyNames] = useState([]);
  const [addPDF, setAddPDF] = useState(false);


  useEffect(()=> {   
    const checkingToken = async () => {
      // console.log(`useEffect familia ${logged?.url}`);
      try {               
        if(logged?.role && logged?.role === 'admin') {
          // Devuelve todos los nombres de las familias
          const families = await getAllFamiliyNamesService(token);          
          // console.log(families);    
        }        
        
        // Si intentamos navegar a otra familia que no es la nuestra nos redirige a nuestra url
        if(logged?.url && logged?.url !== url) {
          navigate(`/familia/${logged?.url}`);
        }
        
        

      } catch (error) {
        setError(error.message);
      }
    }
    if(!token) navigate("/"); 
    token && logged?.url && logged?.role && checkingToken();
  }, [logged?.url, logged?.role, token, navigate, url]);

  return(
    <>
      {token && familyNames && logged?.role === 'admin' ? (
        <section className="family-page">          
          <h2 className="family__h2">Administrador</h2>
        </section>
      ) : (
        <section className="family-page">
          <h2 className="family__h2">Familia {logged?.lineage}</h2>
          {/* <PDF familyNames={familyNames}/> */}
          <section className="pdf--selected">
        {addPDF ? <PDF/> :
         (pdfs.length > 0) ? <embed src={`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/static/data/${url}/${selectedPdf || pdfs[0]}`} type="application/pdf" className="pdf__embed"/> : null}
      </section>
        </section>
      )}
    </>
  )
}

