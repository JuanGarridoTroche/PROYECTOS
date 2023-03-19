import ("../css/Header.css")
export const Header = () => {
  return (
    <header>
      <section className="brand-container">
        <img src="/wallet.svg" alt="xp account logo" />
        <h3><span>xp</span>account</h3>
      </section>
      <section className="menu-container">
        <ul>
          <li>Inicio</li>
          <li>Contacto</li>
          <li>Sobre nosotros</li>
        </ul>
      </section>
      <section className="hamburger-container nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </section>
    </header>
  )
}