import { useParams } from "react-router-dom"

export const ReadEntries = ()=> {
  const idAccount = useParams();
  console.log(idAccount);
  return(
    <section className="account-entries-container">
      <h2>Asientos bancarios de la cuenta</h2>      
    </section>
  )
}