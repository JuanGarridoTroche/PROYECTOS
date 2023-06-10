import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import PropTypes from 'prop-types';
import { AuthContext } from "../context/AuthContext";
import { getFamiliyNamesService } from "../services";
import { useNavigate, useParams } from "react-router-dom";
import ("../css/Family.css")

export const Family = ({lineage})=> {
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
      <Header lineage={lineage}/>
      <h2 className="family__h2">Familia {lineage}</h2>
      <object data={import ("../assets/data/Cabalar.pdf")} type="application/pdf" width="80%" height="80%"></object>
      <p>Logueado como familia {logged?.lineage}</p>
    </>
  )
}

Family.propTypes = {
  lineage: PropTypes.string,
}