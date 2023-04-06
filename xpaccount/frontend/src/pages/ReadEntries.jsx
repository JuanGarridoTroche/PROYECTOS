import("../css/ReadEntries.css");
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  readEntriesByAccountService,
  readingAccountService,
} from "../services";
import { AddEntry } from "../components/AddEntry";
import { TableHead } from "../components/TableHead";
import { AccountData } from "../components/AccountData";
import { Entries } from "../components/Entries";

export const ReadEntries = () => {
  const { idAccount } = useParams();
  const { token} = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [myAccount, setMyAccount] = useState({});
  const [suma, setSuma] = useState(0);
  const [recoverEntries, setRecoverEntries] = useState(false);

  let myNewPropEntries = [];

  // Cargar asientos bancarios de la cuenta con token e idAccount
  useEffect(() => {
    const loadEntriesByAccount = async () => {
      try {
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
      <AccountData myAccount={myAccount} suma={suma}/>
      <section className="account-entries-container">
        {entries && entries.length > 0 ? (
          <table className="entries-table">
            <TableHead />
            <tbody className="tbody-entries">
              {entries.reverse().map((entry) => {
                return (
                  <Entries entry={entry} recoverEntries={recoverEntries} setRecoverEntries={setRecoverEntries} key={entry.id}/>
                );
              })}
            </tbody>
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
