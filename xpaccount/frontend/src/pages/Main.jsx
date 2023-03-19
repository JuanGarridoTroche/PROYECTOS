import("../css/Main.css")
import { useState } from "react"
import { Home } from "../components/Home";


export const Main =()=> {
  const [page, setPage] = useState(0);

  return (
    <main>
      {!page ? <Home /> : null}
    </main>
      )
}