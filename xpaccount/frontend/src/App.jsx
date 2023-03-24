import ("./css/Main.css")
import ("./css/style.css")

import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Accounts } from "./pages/Accounts";
import { CreateAccount } from "./pages/CreateAccount";
import { Footer } from "./pages/Footer";
import { Header } from "./pages/Header";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";
import { ValidateUSer } from "./pages/ValidateUser";

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
        {/* Validar una nueva cuenta de usuario  */}
        <Route path="/register/validate/:registrationCode" element={<ValidateUSer/>}/>
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

