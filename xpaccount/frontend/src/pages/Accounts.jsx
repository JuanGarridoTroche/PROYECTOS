
import("../css/Accounts.css");
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAccountsUserService } from "../services";

export const Accounts = ({balance}) => {
  const [myAccounts, setMyAccounts] = useState([]);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [suma, setSuma] = useState(0); 
  const [accountBalance, setAccountBalance] = useState(balance)
  

  useEffect(() => {
    const getAccountsData = async () => {      
      try {
        if(!token) {
          navigate("/")
        };
        const getAccounts = await getAccountsUserService(token);
        if (getAccounts) {         
          setMyAccounts(getAccounts);
        }
        
        console.log(balance[0].balance);
        
      } catch (error) {
        alert(error.message);
      }
    };
    getAccountsData();
  }, [token]);
  
  useEffect(()=> {
    if(balance) {
      const calculatingBalanceTotal = balance.reduce((acc, curr) => acc + parseFloat(curr.balance), 0)
      console.log(calculatingBalanceTotal);
      setSuma(calculatingBalanceTotal);
      setAccountBalance(balance)
    }    

  }, [balance])
  
  

  return (
    <section className="accounts-container">
      <a className="create-account" href="/accounts/create">
        <img src="/plus.svg" />
        <p>Crear cuenta</p>
      </a>
      <section className="accounts-content">
        <details className="accounts-summary" open>
          <summary>
            <span>Mis</span>cuentas [{suma.toFixed(2)} €]
          </summary>
          {myAccounts.map((account, index) => {            
            return (
              <Link to={`/account/${account.id}`} key={account.id}>
                <section className="account-content">
                  <div className="data">
                    <h3>{account.alias} (<span>{account.bankName}</span>)</h3>
                    <p>{account.accountNumber}</p>
                  </div>
                  <p className="money">[{balance[index].balance.toFixed(2)} €] </p>
                </section>
              </Link>
            );
          })}
        </details>
      </section>
    </section>
  );
};
