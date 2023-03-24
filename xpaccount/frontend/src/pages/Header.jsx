import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import("../css/Header.css");
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {logged, token, logout} = useContext(AuthContext);  
  // console.log(logged);
  return (
    <header>
      <section className="brand-container">
        <Link to="/"><img src="/wallet.svg" alt="xp account logo" /></Link> 
        <h3>
          <span>xp</span>account
        </h3>
      </section>
      <section className={`menu-container nav-items ${isOpen && "open"}`} onClick={() => {
        setIsOpen(!isOpen);        
        }}>
        <h3>Usuario</h3>
        <ul>
          <li>{token && logged?.username ? <Link to="/updateUserProfile">{logged.username}</Link> : null}</li>
          <li>{token && logged ? <Link to="/accounts"><span>mis</span>cuentas</Link> : <Link to="/login">login</Link> }</li>          
          <li>{token && logged ? <Link to="/" onClick={()=> {
            logout();
          }}>salir</Link> : <Link to="/register">regístrate</Link> }</li>
        </ul>
      </section>
      <section className={`hamburger-container nav-toggle ${isOpen && "open"}`} onClick={() => {
        setIsOpen(!isOpen);        
      }}>
        <span></span>
        <span></span>
        <span></span>
      </section>
    </header>
  );
};
