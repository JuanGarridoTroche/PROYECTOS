import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ("../css/Header.css")

export const Header = ({lineage})=> {
  const [error, setError] = useState("");
  const {logout} =useContext(AuthContext);
  const navigate = useNavigate();

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
        <p className='header__family'>Familia {lineage}</p>
      </section>
      <nav className='header__nav navbar'>
        <ul className='navbar__list'>
          <li className='navbar__item'><a href="/">Inicio</a></li>
          <li className='navbar__item'><a href="#">{lineage}</a></li>
          <li className='navbar__item'><a href="#" onClick={handleLogout}>salir</a></li>
        </ul>
      </nav>
    </header>
  )
}

Header.propTypes = {
  lineage: PropTypes.string,
}