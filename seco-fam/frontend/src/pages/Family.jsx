import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import PropTypes from 'prop-types';
import { AuthContext } from "../context/AuthContext";
import { getAllFamiliyNamesService, getFamiliyNamesService } from "../services";
import { useNavigate, useParams } from "react-router-dom";
import ("../css/Family.css")

export const Family = ()=> {
  const {token, logged} = useContext(AuthContext);
  const navigate = useNavigate();
  const {url} = useParams();
  const [error, setError] = useState("");
  const [familyNames, setFamilyNames] = useState([]);

  useEffect(()=> {   
    const checkingToken = async () => {
      try {       
        // console.log(logged?.url);
        // console.log(url);
        if(logged?.url !== url) {
          navigate(`/familia/${logged?.url}`);
        }
        const getFamilyName = await getFamiliyNamesService(token, url);   
        
        if(logged?.role === 'admin') {
          const families = await getAllFamiliyNamesService(token);
          setFamilyNames(families);         
        }
        
      } catch (error) {
        setError(error.message);
      }
    }
    if(!token) navigate("/"); 
    if (logged?.url)checkingToken();
  }, [logged?.url, token, navigate, url]);


  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    try {
      
    } catch (err) {
      setError(err.message);
    }
  }


  return(
    <>
      <Header lineage={logged?.lineage}/>
      <h2 className="family__h2">Familia {logged?.lineage}</h2>
      {logged?.role === 'admin' ? (
        <>
          <h3 className="admin--pdf">PDFs de las familias</h3>
          <form className="admin__form" onSubmit={handleSubmit}>
            <select name="families" id="families" className="admin__select">
              <option value="">Elige familia...</option>
              {familyNames.map((family)=> {
                return (<option value={family.lineage} key={family.id}>
                  {family.lineage}
                </option>)
              })}
            </select>
            <label htmlFor="uploadPDF"> Subir pdf</label>
            <input name="uploadPDF" id="uploadPDF" type="file" formEncType="multipart/form-data" multiple={false} accept="application/pdf,application/vnd.ms-excel"/>
            <button>Enviar</button>
          </form>
        </>
      ) : 
        (
          <>
            {/* <a href={`http://localhost:4000/static/data/${logged?.pdf}`} target="_blank" rel="noopener noreferrer">Familia {logged?.lineage}</a>
            <a href={`http://localhost:4000/static/data/${logged?.pdf}`} target="_blank" rel="noopener noreferrer"><img src="/logo.svg" alt=" descargar" /></a> */}
            {/* <p>Logueado como familia {logged?.lineage}</p> */}
            <iframe                
                src={`http://localhost:4000/static/data/${logged?.pdf}`}
                >Tu navegador no soporta iframe
            </iframe>
          </>
        )
      }
    </>
  )
}

Family.propTypes = {
  lineage: PropTypes.string,
}