
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AccountData = ({myAccount, suma})=> {
  const navigate = useNavigate();
  const {idAccount} = useParams();
  const [error, setError] = useState(false);
 

  return (
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
        <section className="account-content">          
          <a className="create-category" href={`/account/${idAccount}/graphs`}>
            <img src="/plus.svg" />
            <p>Gráficas</p>
          </a>         
        </section>
        <section className="error">{error ? <p>{error}</p> : null}</section>
      </section>
  )
}