
import("../css/Accounts.css");
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAccountsUserService } from "../services";

export const Accounts = () => {
  const [myAccounts, setMyAccounts] = useState([]);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [suma, setSuma] = useState(0); 
  

  useEffect(() => {
    const getAccountsData = async () => {      
      try {
        if(!token) {
          navigate("/")
        };
        const getAccounts = await getAccountsUserService(token);
        if (getAccounts) {         
          setMyAccounts(getAccounts);
          handleAccountBalance;
        }

      } catch (error) {
        alert(error.message);
      }
    };
    getAccountsData();
  }, [token]);

  const handleAccountBalance = async(e) => {
    e.preventDefault();
    setError("")
    try {
      console.log("total suma de la cuenta");      
    } catch (err) {
      setError(err.message)
    }
  }
 

  return (
    <section className="accounts-container">
      <a className="create-account" href="/accounts/create">
        <img src="/plus.svg" />
        <p>Crear cuenta</p>
      </a>
      <section className="accounts-content">
        <details className="accounts-summary" open>
          <summary>
            <span>Mis</span>cuentas [{} €]
          </summary>
          {myAccounts.map((account) => {            
            return (
              <Link to={`/account/${account.id}`} key={account.id}>
                <section className="account-content">
                  <div className="data">
                    <h3>{account.alias} (<span>{account.bankName}</span>)</h3>
                    <p>{account.accountNumber}</p>
                  </div>
                  <p className="money">{suma[account.id]}</p>
                </section>
              </Link>
            );
          })}
        </details>
      </section>
    </section>
  );
};
