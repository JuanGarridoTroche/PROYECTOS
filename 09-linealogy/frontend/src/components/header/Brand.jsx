import { Link } from "react-router-dom"


export const Brand = ()=> {
  
  return (
    <figure className="menu-header-figure">
      <Link to="/">
        <img src="/lineage-logo.png" alt="Logo de Lineage" className="menu-header-figureLogo"/>
      </Link>
      <p  className="menu-header-figureName">Linea<span className="g">g</span>e</p>
    </figure>
  )
}