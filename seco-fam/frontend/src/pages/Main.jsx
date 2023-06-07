import { useState } from "react";
import ("../css/Main.css");
import { loginUserService } from "../services";
import { useNavigate } from "react-router-dom";


export const Main = ()=> {
  const [password, setPassword] = useState("");
  const [lineage, setLineage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");    
    try {      
      const checkingPass = await loginUserService(password);      
      
      if(!checkingPass){              
        throw new Error("Contraseña incorrecta");
      }
      setLineage(checkingPass);

      console.log("Bienvenido a la familia " + checkingPass);
      navigate(`/${lineage.toLowerCase()}`);
      
    } catch (err) {
      setError(err.message);
    }
  }
  return(
    <>
      <h1 className="main__title">Familia Seco</h1>
      <main className="main">      
        {error ? <p className="main__error">{error}</p> : null}
        <form onSubmit={handleSubmit} action="#" method="get" className="main__form">
          {/* <label htmlFor="lineage" className="main__lineage--label"></label> */}
          {/* <input type="text" name="lineage" id="lineage" className="main__lineage main__input" placeholder="Escribe el nombre de tu familia..." onChange={(e)=> {setError(""); setLineage(e.target.value)}}/> */}
          {/* <label htmlFor="pass" className="main__pass--label">Escribe tu contraseña </label> */}
          <input type="password" id="pass" className="main__pass main__input" placeholder="Introduzca su contraseña" autoComplete="on" onChange={(e)=> {setError(""); setPassword(e.target.value)}}/>
          <button className="main__button">Enviar</button>
        </form>
      </main>
    </>
  )
}