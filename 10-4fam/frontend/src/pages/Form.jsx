import ("../css/Form.css");
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { sendMailService } from "../services";
import Modal from "../components/Modal";


export const Form = ()=> {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const[subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const navigate = useNavigate();
  const {token} = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false); 

  
  
  const handleSubmit = async (e)=> {
    e.preventDefault();
    setError("")
    try {    
      if(!token) {
        navigate("/");
      }
      
      if(!name || !subject || !text || !emailContact) {
        throw new Error("Debes cumplimentar todos los campos")
      }
      
      await sendMailService({token, name, emailContact, text, subject }); 
      setName("");
      setEmailContact("");
      setText("");
      setSubject("");
      setShowModal(true);
    } catch (err) {
      setError(err.message)
    }
  }

  return (
  <section className="contact">
    <h2 className="contact__title">Ayúdanos a mejorar</h2>
    <form className="contact__form" onSubmit={handleSubmit}>
      {error ? <p className="error">{error}</p> : null}
      <label htmlFor="name" className="contact__label contact__label--name">Nombre del usuario: <span>*</span></label>
      <input value={name} type="text" id="name" className="contact__input contact__input--name" placeholder="Escribe tu nombre..." onChange={(e) => {
        setError("");
        setName(e.target.value)}}/>
      <label htmlFor="emailContact" className="contact__label contact__label--email">Correo de contacto: <span>*</span></label>
      <input value={emailContact} type="email" id="emailContact" className="contact__input contact__input--email" placeholder="Escribe tu correo..." onChange={(e) => {
        setError("");
        setEmailContact(e.target.value)}}/>
      <label htmlFor="subject" className="contact__label contact__label--subject">Asunto: <span>*</span></label>
      <input value={subject} type="text" id="subject" className="contact__input contact__input--subject" placeholder="Escribe el asunto del correo..." onChange={(e) => {
        setError("");
        setSubject(e.target.value)}}/>
      <label htmlFor="textarea" className="contact__label contact__label--textarea">Mensaje <span>*</span></label>
      <textarea value={text} className="contact__textarea" name="textarea" id="textarea" cols="40" rows="15" placeholder="Escribe aquí la información que crees que nos falta..." onChange={(e)=> {
        setError("");
        setText(e.target.value)}}></textarea>
      <button className="contact__button">Enviar</button>
    </form>
    {showModal && (
      <Modal setShowModal={setShowModal}>
        Correo enviado al administrador!
      </Modal>
    )}
  </section>
  )
}