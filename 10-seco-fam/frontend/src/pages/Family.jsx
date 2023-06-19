import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
// import PropTypes from 'prop-types';
import { AuthContext } from "../context/AuthContext";
import { getAllFamiliyNamesService, getFamiliyNamesService } from "../services";
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
      <section className="family-page">
        {logged?.role === "admin" ? <Aside/>: null}
        <h2 className="family__h2">Familia {logged?.lineage}</h2>
        <AddPDF familyNames={familyNames}/>
      </section>
    </>
  )
}

// Family.propTypes = {
//   lineage: PropTypes.string,
//   familyNames: PropTypes.arrayOf(PropTypes.string)
// }