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


  useEffect(()=> {   
    const checkingToken = async () => {
      try {       
        // console.log(logged?.url);
        // console.log(url);
        
        if(logged?.role && logged?.role === 'admin') {
          const families = await getAllFamiliyNamesService(token);
          setFamilyNames(families);     
        }        
        
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
          {/* Sube un fichero PDF */}
          {/* <PDF familyNames={familyNames}/> */}
        </section>
      ) : (
        <section className="family-page">
          <h2 className="family__h2">Familia {logged?.lineage}</h2>
          <PDF familyNames={familyNames}/>
        </section>
      )}
    </>
  )
}

