import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import PropTypes from 'prop-types';
import { AuthContext } from "../context/AuthContext";
import { getFamiliyNamesService } from "../services";
import { useNavigate, useParams } from "react-router-dom";
import ("../css/Family.css")

export const Family = ()=> {
  const {token, logged} = useContext(AuthContext);
  const navigate = useNavigate();
  const {url} = useParams();
  const [error, setError] = useState("");

  useEffect(()=> {   
    const checkingToken = async () => {
      try {       
        // console.log(logged?.url);
        // console.log(url);
        if(logged?.url !== url) {
          navigate(`/familia/${logged?.url}`);
        }
        const getFamilyName = await getFamiliyNamesService(token, url);        
        
      } catch (error) {
        setError(error.message);
      }
    }
    if(!token) navigate("/"); 
    if (logged?.url)checkingToken();
  }, [logged?.url, token, navigate, url])


  return(
    <>
      <Header lineage={logged?.lineage}/>
      <h2 className="family__h2">Familia {logged?.lineage}</h2>
      <a href="../assets/data/Cabalar.pdf" target="_blank" rel="noopener noreferrer">Familia Cabalar</a>
      <iframe
          width="800"
          height="600"
          src="../assets/data/Cabalar.pdf"
          >Tu navegador no soporta iframe
      </iframe>
      <p>Logueado como familia {logged?.lineage}</p>
    </>
  )
}

Family.propTypes = {
  lineage: PropTypes.string,
}