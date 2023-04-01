import { useContext, useState } from "react";
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";

export const CreateCategory =()=> {
  const {idAccount} =useParams();
  const [error, setError] = useState("");
  const {token} = useContext(AuthContext);


  return (
    <h2>Crear categoría</h2>
  )
}