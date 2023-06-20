import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotFound } from "../pages/NotFound";

export const Anca = ()=> {
  const {logged} = useContext(AuthContext);
  const navigate = useNavigate();
  if(logged?.role === 'user') {
    navigate("/page-not-found");
  }
  
  return (
    <section>
      <h3>Documentos pdf</h3>
      <article>
        <figure>
          <img src="/file-pdf-regular.svg" alt="pdf" />
        </figure>
        <section>
          Familia Anca
        </section>
      </article>
    </section>
  )
}