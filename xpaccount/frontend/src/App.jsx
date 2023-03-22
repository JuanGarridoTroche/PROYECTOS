import ("./css/Main.css")
import { Routes, Route } from "react-router-dom";
// import {Accounts, CreateAccount, Footer, Header, Login, NotFound, Register } from "./pages"
import { Home } from "./components/Home";
import { Accounts } from "./pages/Accounts";
import { CreateAccount } from "./pages/createAccount";
import { Footer } from "./pages/Footer";
import { Header } from "./pages/Header";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";

import ("./css/style.css")

function App() {
 
  return (
  <>
    <Header />
    <main>      
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* Login de usuario */}
        <Route path="/login" element={<Login/>} />
        {/* Regsitro de usuario */}
        <Route path="/register" element={<Register />} />
        {/* Mostrar las cuentas de un usuario registrado */}
        <Route path="/accounts" element={<Accounts/>}/>
        {/* Crear una cuenta nueva */}
        <Route path="/accounts/create" element={<CreateAccount/>}/>
        {/* Página no encontrada */}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    <Footer />
  </>
  );
}

export default App;

