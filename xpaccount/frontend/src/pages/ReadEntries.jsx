import("../css/ReadEntries.css");
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  loadCategories,
  loadSubcategories,
  readEntriesByAccountService,
  readingAccountService,
} from "../services";
import { AddEntry } from "../components/AddEntry";

export const ReadEntries = () => {
  const { idAccount } = useParams();
  const { token, logged } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [myAccount, setMyAccount] = useState({});
  const [suma, setSuma] = useState(0);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  let selectedCat = "";
  
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


  // Cargar todas las categorías con token e idAccount
  useEffect(() => {
    const loadMyCategories = async () => {
      setError("");
      try {        
        // Conseguir todas las categorías de la cuenta con idAccount
        const myCategories = await loadCategories(token, idAccount);
        setCategories([...myCategories]);
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) {
      loadMyCategories();
    }
  }, []);

  const handleSubcategories = async(selectedCat, idCategory) => {
    setError("");
    try {
      if(selectedCat ==="Elige una opción...") {
        return
      }
      idCategory = categories.find(element => element.name === selectedCat).id;
      
      const mySubcats = await loadSubcategories(token, idCategory);
      setSubcategories(mySubcats);
    } catch (err) {
      setError(err.message);
    }
  }


  // Maneja añadir un asiento bancario
  const handleAddEntry = async () => {
    setError("");
    try {
      // alert("Añadir una entrada");
    } catch (err) {
      setError(err.message);
    }
  };

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
            <thead className="table-header">
              <tr>
                <th>FECHA</th>
                <th>CATEGORÍA</th>
                <th>SUBCATEGORÍA</th>
                <th>IMPORTE</th>
                <th>TOTAL</th>
                <th className="concept">CONCEPTO</th>
                <th className="comment">COMENTARIO</th>
              </tr>
            </thead>

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
            <tbody className="tbody-new-entry">
              <tr>
                <td>
                  <input
                    type="date"
                    onChange={(e) => {
                      e.target.value;
                    }}
                  />
                </td>
                <td>
                  <select name="categories" onClick={(e)=>{                    
                          handleSubcategories(e.target.value);
                        }}>
                    <option defaultValue="default">Elige una opción...</option>
                    {categories.map((category=> {
                      return (
                        <option key={category.id}>{category.name}</option>
                      )
                    }))}
                  </select>
                </td>
                <td>
                  <select name="subcategories">
                  <option defaultValue="default">Elige una opción...</option>
                  {subcategories.map((subcategory=>{
                    return (
                      <option key={subcategory.id}>{subcategory.name}</option>
                    )
                  }))}
                  </select>
                </td>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" disabled />
                </td>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
                <td><button
                  onClick={() => {
                    handleAddEntry();
                  }}
                >
                  Añadir
                </button></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            <h3>No hay asientos bancarios</h3>
            <AddEntry/>
          </>
        )}
      </section>
    </>
  );
};
