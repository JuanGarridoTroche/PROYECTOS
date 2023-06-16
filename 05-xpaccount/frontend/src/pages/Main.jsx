import("../css/Main.css")
import { useState } from "react"
import { Home } from "../components/Home";

// Candidato a ser borrado


export const Main =()=> {
  const [page, setPage] = useState(0);

  return (
    <>
      
      {!page ? <Home /> : null}
    </>
      )
}