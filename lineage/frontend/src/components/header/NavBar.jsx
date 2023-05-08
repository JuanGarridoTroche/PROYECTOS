import { Auth } from "./Auth"
import { Login } from "./Login"

export const NavBar = ()=> {
  return (
    <nav className="menu-header-navbarInfo">
      <Auth/>
      <Login/> 
    </nav>
  )
}