
import("../css/Accounts.css");
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAccountsUserService } from "../services";

export const Accounts = () => {
  const [myAccounts, setMyAccounts] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const getAccountsData = async () => {      
      try {
        const getAccounts = await getAccountsUserService(token);
        if (getAccounts) {         
          setMyAccounts(getAccounts);
        }

        getAccounts.map((account) => {
        })
      } catch (error) {
        alert(error.message);
      }
    };
    getAccountsData();
  }, [token]);

  return (
    <section className="accounts-container">
      <a className="create-account" href="/accounts/create">
        <img src="/plus.svg" />
        <p>Crear cuenta</p>
      </a>
      <section className="accounts-content">
        <details className="accounts-summary" open>
          <summary>
            <span>Mis</span>cuentas [6847,89 €]
          </summary>
          {myAccounts.map((account) => {
            return (
              <a href={`/user/accounts/${account.id}`} key={account.id}>
                <section className="account-content">
                  <div className="data">
                    <h3>{account.alias}</h3>
                    <p>{account.accountNumber}</p>
                  </div>
                  <p className="money">3500 Eur</p>
                </section>
              </a>
            );
          })}
        </details>
      </section>
    </section>
  );
};
