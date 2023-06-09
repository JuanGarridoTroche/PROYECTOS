import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ("../css/Header.css")

export const Header = ({lineage})=> {
  const [error, setError] = useState("");
  const {token, logout} =useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=> {
    const getFamilyNames = async() => {
      try {
        const families = await getFamiliyNamesService(token);
        console.log(families);
      } catch (err) {
        
      }
    }
    
  },[token])

  

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
        {lineage === 'admin' ? null : <p className='header__family'>Familia {lineage}</p>}
      </section>
      <nav className='header__nav navbar'>
        {lineage === 'admin' ? (
        <ul className='navbar__list'>
          <li className='navbar__item'><a href="/">Inicio</a></li>
          <li className='navbar__item'><a href="#">{lineage}</a></li>
          <li className='navbar__item'><a href="#" onClick={handleLogout}>salir</a></li>
        </ul>
        ) : (
        <ul className='navbar__list'>
          <li className='navbar__item'><a href="#" onClick={handleLogout}>salir</a></li>
        </ul>
        )}        
      </nav>
    </header>
  )
}

Header.propTypes = {
  lineage: PropTypes.string,
}