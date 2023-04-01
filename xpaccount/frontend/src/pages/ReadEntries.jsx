import("../css/ReadEntries.css");
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  readEntriesByAccountService,
  readingAccountService,
} from "../services";
import { AddEntry } from "../components/AddEntry";
import { TableHead } from "../components/TableHead";

export const ReadEntries = () => {
  const { idAccount } = useParams();
  const { token} = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [myAccount, setMyAccount] = useState({});
  const [suma, setSuma] = useState(0);
  const navigate = useNavigate();
  
  let total = 0;

  // Cargar asientos bancarios de la cuenta con token e idAccount
  useEffect(() => {
    const loadEntriesByAccount = async () => {
      try {
        let tot = 0;
        setError("");

        // Leer los datos de la cuenta
        const readingAccount = await readingAccountService({
          idAccount,
          token,
        });
        setMyAccount(readingAccount);

        // Leer todas los asientos de la cuenta idAccount
        const readingEntries = await readEntriesByAccountService({
          idAccount,
          token,
        });

        if(readingEntries){
          setEntries(readingEntries);
          readingEntries.map((entry) => {
            tot = tot + parseFloat(entry.amount);
          });
          setSuma(tot);
        }

      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      loadEntriesByAccount();
    }
  }, [token]);

  return (
    <>
      <section className="my-account container">
        <div className="title-content">
          <h2>
            Cuenta <span>{myAccount.alias}</span>
          </h2>
          <button
            onClick={() => {
              navigate("/accounts");
            }}
          >
            Volver
          </button>
        </div>
        <section className="error">{error ? <p>{error}</p> : null}</section>
        <section className="account-content">
          <div className="data" key={myAccount.id}>
            <h3>
              {myAccount.alias} (<span>{myAccount.bankName}</span>)
            </h3>
            <p>{myAccount.accountNumber}</p>
          </div>
          {suma < 0 ? (
            <p className="money" style={{ color: "red" }}>
              {suma.toFixed(2)} Eur
            </p>
          ) : (
            <p className="money">{suma.toFixed(2)} Eur</p>
          )}
        </section>
      </section>
      <section className="account-entries-container">
        {entries.length > 0 ? (
          <table className="entries-table">
            <TableHead/>
            {entries.map((entry, index) => {
              return (
                <tbody key={entry.id} className="tbody-entries">
                  <tr>
                    <td>{entry.dateEntry}</td>
                    <td>{entry.category}</td>
                    <td>{entry.subcategory}</td>
                    <td className="numbers">
                      {parseFloat(entry.amount).toFixed(2)} EUR
                    </td>
                    <td className="numbers">
                      {index === 0
                        ? `${(total = parseFloat(entry.amount))} EUR`
                        : `${(total = total + parseFloat(entry.amount))} EUR`}
                    </td>
                    <td className="concept">{entry.concept}</td>
                    <td className="comment">{entry.comment}</td>
                    <td><button>Editar</button></td>
                  </tr>
                </tbody>
              );
            })}
            <AddEntry entries={entries}/>
          </table>
        ) : (
          <>
            <h3>No hay asientos bancarios</h3>
            <table>
              <AddEntry entries={entries}/>
            </table>
          </>
        )}
      </section>
    </>
  );
};
