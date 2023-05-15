import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

export const NavBar = ()=> {
  const {token, authorizedUser, logout} = useContext(AuthContext);
  console.log(authorizedUser?.first_name);
  return (
    <nav className="menu-header-navbarInfo">
      <ul className="menu-header-navbarAuth">
        {token ? (
        <>
          <li><Link to="/register">Juan Pérez</Link></li>
          <li><Link to="/login" onClick={()=>logout()}>Cerrar sesión</Link></li>
        </>
        ) : (
        <>
          <li><Link to="/register">Regístrate</Link></li>
          <li><Link to="/login">Login</Link></li>
        </>
        )
      }
      </ul>
    </nav>
  )
}