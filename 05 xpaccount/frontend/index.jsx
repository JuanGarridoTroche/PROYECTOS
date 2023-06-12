import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./src/App";
import { AuthProvidercomponent } from "./src/context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<BrowserRouter>
  <AuthProvidercomponent>
    <App />
  </AuthProvidercomponent>
</BrowserRouter>
);
