import("../css/Home.css");
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Home = () => {
  const { token } = useContext(AuthContext);  

  return (
    <section className="section-main-container">
      <h1>Controla tus ahorros</h1>
      <p>a través de una aplicación cómoda y sencilla que te hará disfrutar</p>
      {
        token ? 
        <Link to="/accounts" className="start">
        Mis cuentas
      </Link>
        :
        <Link to="/login" className="start">
        Comenzar
      </Link>
      }
    </section>
  );
};
