// import { Modal } from "../components/main/Modal";
import { Link } from 'react-router-dom';
import '../css/Notfound.css';

export const NotFoundPage = () => {
  return (
    <section className="section--not-found">
      <h2 className="section__h2--not-found">Página no encontrada</h2>
      <Link to={"/"} className='section__a--not-found'>Volver al inicio</Link>
    </section>
  )
  // return <Modal title={"Página no encontrada"} message={"La página que estás buscando no existe"} />;
};