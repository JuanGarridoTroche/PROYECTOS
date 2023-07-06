import ("../css/Form.css");
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { sendMailService } from "../services";
import { useNavigate } from "react-router-dom";


export const Form = ()=> {
  const {logged, token} = useContext(AuthContext);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const[subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

 
  const handleSubmit = async (e)=> {
    e.preventDefault();
    setError("")
    try {    
      if(!token) {
        navigate("/");
      }

      if(!name || !subject || !text) {
        throw new Error("Debes cumplimentar todos los campos")
      }

      await sendMailService({token, name, text, subject });

      
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h2 className="title-form">Ayúdanos a mejorar</h2>
      {error ? <p className="error">{error}</p> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name" className="form__label form__label--name">Nombre del usuario:</label>
        <input type="text" id="name" className="form__input form__input--name" placeholder="Escribe tu nombre..." onChange={(e) => {
          setError("");
          setName(e.target.value)}}/>
        <label htmlFor="subject" className="form__label form__label--subject">Asunto:</label>
        <input type="text" id="subject" className="form__input form__input--subject" placeholder="Escribe el asunto del correo..." onChange={(e) => {
          setError("");
          setSubject(e.target.value)}}/>
        <label htmlFor="textarea" className="form__label form__label--textarea" hidden></label>
        <textarea className="form__textarea" name="textarea" id="textarea" cols="40" rows="15" placeholder="Escribe aquí la información que crees que nos falta..." onChange={(e)=> {
          setError("");
          setText(e.target.value)}}></textarea>
        <button className="form__button">Enviar</button>
      </form>
    </>
  )
}