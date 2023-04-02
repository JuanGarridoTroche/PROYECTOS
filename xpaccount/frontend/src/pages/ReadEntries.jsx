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
  const { token } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [myAccount, setMyAccount] = useState({});
  const [suma, setSuma] = useState(0);
  const navigate = useNavigate();
  const [recoverEntries, setRecoverEntries] = useState(false);

  let myNewPropEntries = [];
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

        if (readingEntries.length > 0) {
          let balance = 0;

          myNewPropEntries = readingEntries.reverse().map((entry, index) => {
            if (index === 0) {
              balance = parseFloat(entry.amount);
            } else {
              balance = balance + parseFloat(entry.amount);
            }
            const myNewObj = {
              id: entry.id,
              dateEntry: entry.dateEntry,
              category: entry.category,
              subcategory: entry.subcategory,
              amount: entry.amount,
              total: balance,
              concept: entry.concept,
              comment: entry.comment,
            };
            return myNewObj;
          });
          setEntries(myNewPropEntries);
          setSuma(myNewPropEntries[myNewPropEntries.length - 1].total);
        }

        
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      loadEntriesByAccount();
    }
  }, [token, recoverEntries]);

  return (
    <>
      <section className="my-account-container">
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
        <section className="account-content">          
          <a className="create-category" href={`/account/${idAccount}/categories`}>
            <img src="/plus.svg" />
            <p>Categorías</p>
          </a>         
        </section>
        <section className="error">{error ? <p>{error}</p> : null}</section>
      </section>
      <section className="account-entries-container">
        {entries.length > 0 ? (
          <table className="entries-table">
            <TableHead />
            {entries.reverse().map((entry) => {
              return (
                <tbody key={entry.id} className="tbody-entries">
                  <tr>
                    <td>{entry.dateEntry}</td>
                    <td>{entry.category}</td>
                    <td>{entry.subcategory}</td>
                    <td className={parseFloat(entry.amount) > 0 ? "numbers" : "numbers negative"}>
                      {parseFloat(entry.amount).toFixed(2)} EUR
                    </td>
                    <td className={parseFloat(entry.total) > 0 ? "numbers" : "numbers negative"}>
                        {parseFloat(entry.total).toFixed(2)} EUR
                    </td>
                    
                    <td className="concept">{entry.concept}</td>
                    <td className="comment">{entry.comment}</td>
                    <td>
                      <button>Editar</button>
                    </td>
                  </tr>
                </tbody>
              );
            })}
            <AddEntry
              entries={entries}
              setEntries={setEntries}
              recoverEntries={recoverEntries}
              setRecoverEntries={setRecoverEntries}
            />
          </table>
        ) : (
          <>
            <h3>No hay asientos bancarios</h3>
            <table>
              <AddEntry
                entries={entries}
                setEntries={setEntries}
                recoverEntries={recoverEntries}
                setRecoverEntries={setRecoverEntries}
              />
            </table>
          </>
        )}
      </section>
    </>
  );
};
