import { Auth } from "../../context/Auth";
import { Brand } from "./Brand";
import ('../../css/Header.css');

export const Header = ()=> {
  return (
    <header className="menu-header">
      <Brand/>  
      <Auth />
    </header>
  )
}