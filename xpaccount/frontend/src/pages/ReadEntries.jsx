import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { readEntriesByAccountService } from "../services";

export const ReadEntries = () => {
  const { idAccount } = useParams();
  const { token } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadEntriesByAccount = async () => {
      try {
        const readingEntries = await readEntriesByAccountService({
          idAccount,
          token,
        });
        setEntries(readingEntries);

        const readingCatsAndSubcats = 
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
        <table key="123456789">
          <tr>
            <th>FECHA</th>
            <th>CATEGORÍA</th>
            <th>SUBCATEGORÍA</th>
            <th>IMPORTE</th>
            <th>CUENTA</th>
            <th>TOTAL</th>
            <th>CONCEPTO</th>
            <th>COMENTARIO</th>
          </tr>

          {entries.map((entry) => {
            return (
              <>
                <tr key={entry.id}>
                  <td>{entry.dateEntry}</td>
                  <td>{entry.category}</td>
                  <td>{entry.subcategory}</td>
                  <td>{entry.amount}</td>
                  <td>{/* {setTotal(total+entry.amount)} */}</td>
                  <td>{entry.concept}</td>
                  <td>{entry.comment}</td>
                </tr>
              </>
            );
          })}
          <tr>
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
