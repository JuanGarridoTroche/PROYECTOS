import PropTypes from 'prop-types';
import ("../css/Header.css")

export const Header = ({lineage})=> {
  
  return(
    <header className='header'>
      <section className='header__brand'>
        <p className='header__family'>Familia {lineage}</p>
      </section>
      <nav className='header__nav navbar'>
        <ul className='navbar__list'>
          <li className='navbar__item'><a href="/">Inicio</a></li>
          <li className='navbar__item'><a href="#">{lineage}</a></li>
          <li className='navbar__item'><a href="#">salir</a></li>
        </ul>
      </nav>
    </header>
  )
}

Header.propTypes = {
  lineage: PropTypes.string,
}