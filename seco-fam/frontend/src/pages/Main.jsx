import { useState } from "react";
import ("../css/Main.css");
import data from "../assets/lineages.json";



export const Main = ()=> {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");    
    try {
      const checkingPass = data.find(e => e.pass === pwd.toString());
      console.log("erre");
      
      if(!checkingPass){
              
        throw new Error("Contraseña incorrecta");
      }

      console.log("contraseña correcta para ",checkingPass.lineage);
      
    } catch (err) {
      setError(err.message);
    }
  }
  return(
    <main className="main">      
    {error ? <p className="main__error">{error}</p> : null}
      <form onSubmit={handleSubmit} action="#" method="get" className="main__form">
        {/* <label htmlFor="pass" className="main__pass--label">Escribe tu contraseña </label> */}
        <input type="password" id="pass" className="main__pass" placeholder="Introduzca su contraseña" autoComplete="on" onChange={(e)=> {setError(""); setPwd(e.target.value)}}/>
        <button className="main__button">Enviar</button>
      </form>
  </main>
  )
}