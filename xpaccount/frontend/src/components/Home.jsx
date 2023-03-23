import("../css/Home.css");
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Home = () => {
  const { logged } = useContext(AuthContext);
  console.log(logged);

  return (
    <section className="section-main-container">
      <h1>Controla tus ahorros</h1>
      <p>a través de una aplicación cómoda y sencilla que te hará disfrutar</p>
      <Link to="/login" className="start">
        Comenzar
      </Link>
      {/* loggedUser ? <Link to="/accounts"/> : <Link to="/login"/> */}
    </section>
  );
};
