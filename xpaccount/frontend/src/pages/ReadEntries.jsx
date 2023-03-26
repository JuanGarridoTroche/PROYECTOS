import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { readEntriesByAccountService } from "../services";

export const ReadEntries = ()=> {
  const idAccount = useParams();
  const {token} = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(()=>{
    const loadEntriesByAccount = async () => {
      try {
        const readingEntries = await readEntriesByAccountService(idAccount);
        console.log(readingEntries);
        setEntries(readingEntries);
      } catch (err) {
        setError(err.message);
      }

    }
    if(token) {loadEntriesByAccount()};
    if(!token) {setError("No estás logueado")}
  },[])

  console.log(entries);
  return(
    <section className="account-entries-container">
      <h2>Asientos bancarios de la cuenta</h2>
      {entries.length > 0 ? (
        <ul>
          {entries.map((entry)=> {
            return (
              <li key={entry.id}>
                {entry.category}
              </li>
            )
          })}
        </ul>
      ) : (
        <h3>No hay asientos bancarios</h3>
      )

      } 
    </section>
  )
}