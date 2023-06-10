import ("../css/Form.css");
import { useContext } from "react";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";


export const Form = ()=> {
  const {logged} = useContext(AuthContext);

  return (
    <>
      <Header lineage={logged?.lineage}/>
      <h2 className="title-form">Ayúdanos a mejorar</h2>
      <form className="form">
        <label htmlFor="textarea" className="form__label" hidden></label>
        <textarea className="form__textarea" name="textarea" id="textarea" cols="40" rows="15" placeholder="Escribe aquí la información que crees que nos falta..."></textarea>
        <button className="form__button">Enviar</button>
      </form>
    </>
  )
}