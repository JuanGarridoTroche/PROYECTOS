import ("../css/Home.css");
import {Link, Navigate} from "react-router-dom";
export const Home = ()=> {

  return (
    <section className="section-main-container">
      <h1>Controla tus ahorros</h1>   
      <p>a través de una aplicación cómoda y sencilla que te hará disfrutar</p>  
      <Link to="/login" className="start">Comenzar</Link>
        {/* loggedUser ? <Link to="/accounts"/> : <Link to="/login"/> */}
      
    </section>
  )
}