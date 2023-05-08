import { Brand } from "./Brand"
import { NavBar } from "./NavBar"
import ('../css/Header.css');

export const Header = ()=> {
  return (
    <header className="menu-header">
      <Brand/>
      <NavBar/>
    </header>
  )
}