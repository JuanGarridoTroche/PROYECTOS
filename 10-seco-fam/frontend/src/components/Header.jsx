import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getAllFamiliyNamesService, getFamilyNameAndPdfsService } from '../services';
import ("../css/Header.css")

export const Header = ({lineage})=> {
  const [error, setError] = useState("");
  const {logged, token, logout} =useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [familyName, setFamilyName] = useState([]);
  const [familyNames, setFamilyNames] = useState([]);
  const navigate = useNavigate();

  useEffect(()=> {
    const getFamilyNames = async() => {
      try {
        if(logged?.url) {

          // Devuelve lineage y los pdfs 
          const myNameFamily = await getFamilyNameAndPdfsService(token, logged?.url);                  
          setFamilyName(myNameFamily);
        }

        if(logged?.role && logged?.role === 'admin') {
          const families = await getAllFamiliyNamesService(token);          
          // console.log(families);   
          setFamilyNames(families) 
        }  
      } catch (err) {
        setError(err.message);
      }
    }
    if(token) getFamilyNames();
  },[token, logged?.url, logged?.role])

  

  const handleLogout =(e) => {
    e.preventDefault();
    setError("");
    try {
      logout();
      navigate("/");    
    } catch (err) {
      setError(err.message);
    }
  }  
  
  return(
    <header className='header'>
      <section className='header__brand'>
        <img src="/logo.svg" alt="logo"/>
        {logged?.role === 'admin' ? null : <p className='header__family'>{lineage}</p>}
      </section>
      <nav className='header__nav navbar'>
        {logged?.role === 'admin' ? (
        (
        <ul className="navbar__list">
          {familyNames.map((family) => {
            return <li className="navbar__name navbar__item" key={family.id}><a href={`/familia/administrator/${family.url}`}>{family.lineage}</a></li>
          })}
           <li className='navbar__item'><a href="#" onClick={handleLogout}>salir</a></li>         
        </ul>
        )
        ) : (
        <ul className='navbar__list'>
          <li className='navbar__item'><a href={`/familia/${logged?.url}`}>familia {logged?.lineage}</a></li>
          <li className='navbar__item'><Link to={"/form"}>contacto</Link></li>
          <li className='navbar__item'><a href="#" onClick={handleLogout}>salir</a></li>
        </ul>
        )}        
      </nav>
      <section className={`hamburger-container nav-toggle ${isOpen && "open"}`} onClick={() => {
        setIsOpen(!isOpen);        
      }}>
        <span></span>
        <span></span>
        <span></span>
      </section>
    </header>
  )
}

Header.propTypes = {
  lineage: PropTypes.string,
}