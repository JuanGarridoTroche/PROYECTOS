import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CustomTokenContextProvider } from "./contexts/TokenContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Pintamos el CustomTokenContextProvider y le pasamos App por la prop children. De esta forma vamos a tener acceso al valor del contexto en toda nuestra App
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomTokenContextProvider>
        <App />
      </CustomTokenContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
