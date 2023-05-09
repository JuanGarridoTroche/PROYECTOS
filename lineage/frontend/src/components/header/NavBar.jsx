import { Link } from "react-router-dom"

export const NavBar = ()=> {
  return (
    <nav className="menu-header-navbarInfo">
      <ul className="menu-header-navbarAuth">
        <li><Link to="/register">Regístrate</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  )
}