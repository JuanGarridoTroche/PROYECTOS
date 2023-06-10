import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

export const NavBar = ()=> {
  const {token, authorizedUser, logout} = useContext(AuthContext);
  
  return (
    <nav className="menu-header-navbarInfo">
      {authorizedUser?.role === "admin" && token ? (      
        <menu className="menu__ul--admin">
          <li className="menu__li--admin"><Link to="/admin/roles">usuarios</Link></li>
        </menu>
      ) : (null)}
      <ul className="menu-header-navbarAuth">
        {authorizedUser && token ? (
        <>
          <li><Link to="/users/profile">{authorizedUser.first_name} {authorizedUser.last_name1} {authorizedUser.last_name2}</Link></li>
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