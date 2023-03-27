import ("../css/ReadEntries.css")
import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { readEntriesByAccountService } from "../services";

export const ReadEntries = () => {
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  let total =0;

  useEffect(() => {
    const loadEntriesByAccount = async () => {
      
      try {
        
        // Leer los datos de la cuenta
        const readingAccount=0;

        // Leer todas los asientos de la cuenta idAccount
        const readingEntries = await readEntriesByAccountService({
          idAccount,
          token,
        });
        setEntries(readingEntries);

        
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      loadEntriesByAccount();
    }
  }, [token]);

  return (
    <section className="account-entries-container">
      <h2>Asientos bancarios de la cuenta</h2>
      {error ? <p>{error}</p> : null}
      {entries.length > 0 ? (
        <table className="entries-table">
          <tr className="table-header">
            <th>FECHA</th>
            <th>CATEGORÍA</th>
            <th>SUBCATEGORÍA</th>
            <th>IMPORTE</th>
            <th>TOTAL</th>
            <th className="concept">CONCEPTO</th>
            <th className="comment">COMENTARIO</th>
          </tr>

          {
            entries.map((entry, index) => {            
            return (
              <>
                <tr key={entry.id} className="tr-entries">
                  <td>{entry.dateEntry}</td>
                  <td>{entry.category}</td>
                  <td>{entry.subcategory}</td>
                  <td>{entry.amount} EUR</td>                  
                  <td>{index === 0 ? `${total = parseFloat(entry.amount)} EUR` : `${total = total + parseFloat(entry.amount)} EUR`}</td>
                  <td className="concept">{entry.concept}</td>
                  <td className="comment">{entry.comment}</td>
                </tr>
              </>
            );
          })}
          <tr className="tr-new-entry">
            <td>
              <input type="date" onChange={(e) => {e.target.value}} />
            </td>
            <td>
              <select onLoad={(e) => {}}/>
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
        </table>
      ) : (
        <h3>No hay asientos bancarios</h3>
      )}
    </section>
  );
};
