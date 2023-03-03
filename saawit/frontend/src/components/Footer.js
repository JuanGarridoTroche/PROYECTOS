import { Link } from "react-router-dom";
import "../css/Footer.css";
export const Footer = () => {
  return (
    <footer>
      <section className="by-saawit">By Saawit 2023 © </section>
      <section className="about-us">
        <Link to="/about">  · sobre nosotros</Link>
      </section>
    </footer>
  );
};
