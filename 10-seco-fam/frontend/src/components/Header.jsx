

export const Header = ()=> {
  
  return (
    <header className="menu">
      <section className="menu__brand">
        <img className="menu__logo" src="/logo-admin.svg" alt=""/>
        <p className="menu__family-name">Cabalar</p>
      </section>
      <nav className="menu__nav">
        <ul className="menu__list">
          <li className="menu__item"><a className="menu__item--home menu__item__link" href="#">Cabalar</a></li>
          <li className="menu__item"><a className="menu__item--contact menu__item__link" href="#">contáctanos</a></li>
          <li className="menu__item"><a className="menu__item--logout menu__item__link" href="#">salir</a></li>
        </ul>
      </nav>
    </header>
  )
}