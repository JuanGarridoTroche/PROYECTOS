import { useState } from "react";

import ("../css/Accounts.css");
export const Accounts =()=> {

  const [accounts, setAccounts] =useState(0);

  return(
    <section className="accounts-container">
      <section className="accounts-content">
      <details className="accounts-summary" open>
        <summary><span>Mis</span>cuentas</summary>
        <a href="/">
          <section className="account-content">
            <div className="data">
              <h3>Cuenta de casa</h3>
              <p>ES2100512345230123456789</p>
            </div>
            <p className="money">3500€</p>
          </section>
        </a>
      </details>
      </section>
    </section>
  )
}