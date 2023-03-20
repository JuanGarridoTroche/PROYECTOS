import { useState } from "react";
import { Link } from "react-router-dom";

import("../css/Header.css");
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        <ul>
          <li>Inicio</li>
          <li>Contacto</li>
          <li>Sobre nosotros</li>
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
