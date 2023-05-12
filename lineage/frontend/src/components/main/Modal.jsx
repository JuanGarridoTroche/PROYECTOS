import { Link } from "react-router-dom";

export const Modal = (title, message) => {
  // console.log(title, message);
  return (
    <section key={title}>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link to={"/"} >Volver al inicio</Link>
    </section>
  );
};


