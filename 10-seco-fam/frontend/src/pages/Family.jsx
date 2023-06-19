import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { getAllFamiliyNamesService } from "../services";
import { useNavigate, useParams } from "react-router-dom";
import { Aside } from "../components/Aside";
import { AddPDF } from "../components/AddPDF";
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
                
        if(logged?.role === 'admin') {
          const families = await getAllFamiliyNamesService(token);
          setFamilyNames(families);
          // console.log(familyNames);      
        }        
        
      } catch (error) {
        setError(error.message);
      }
    }
    if(!token) navigate("/"); 
    if (logged?.url) checkingToken();
  }, [logged?.url, logged?.role, token, navigate, url]);

  return(
    <>
      <Header lineage={logged?.lineage}/>
      {logged?.role === 'admin' ? (
        <section className="family-page">
          {logged?.role === "admin" ? <Aside/>: null}
          <h2 className="family__h2">Familia {logged?.lineage}</h2>
          <AddPDF familyNames={familyNames}/>
        </section>
      ) : (
        <>
          <h2 className="family__h2">Familia {logged?.lineage}</h2>
          <AddPDF familyNames={familyNames}/>
        </>
      )}
    </>
  )
}

