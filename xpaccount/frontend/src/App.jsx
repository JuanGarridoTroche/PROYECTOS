import("./css/Main.css");
import("./css/style.css");

import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Accounts } from "./pages/Accounts";
import { CreateAccount } from "./pages/CreateAccount";
import { Footer } from "./pages/Footer";
import { Header } from "./pages/Header";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ReadEntries } from "./pages/ReadEntries";
import { Register } from "./pages/Register";
import { UserProfile } from "./pages/UserProfile";
import { ValidateUSer } from "./pages/ValidateUser";
import { ReadCategories } from "./pages/ReadCategories";
import { ReadSubcategories } from "./pages/ReadSubcategories";
import { BarChart } from "./components/BarChart";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Inicio */}
          <Route path="/" element={<Home />} />

          {/* Login de usuario */}
          <Route path="/login" element={<Login />} />

          {/* Regsitro de usuario */}
          <Route path="/register" element={<Register />} />

          {/* Validar una nueva cuenta de usuario  */}
          <Route
            path="/register/validate/:registrationCode"
            element={<ValidateUSer />}
          />

          {/* Actualizar perfil de usuario */}
          <Route path="/user/profile" element={<UserProfile />} />

          {/* Mostrar las cuentas de un usuario registrado */}
          <Route path="/accounts" element={<Accounts />} />

          {/* Crear una cuenta nueva */}
          <Route path="/accounts/create" element={<CreateAccount />} />

          {/* Leer las categorías de una cuenta */}
          <Route
            path="/account/:idAccount/categories"
            element={<ReadCategories />}
          />

          {/* Leer las subcategorías de una categoría de la cuenta */}
          <Route path="/account/:idAccount/category/:idCategory" element={<ReadSubcategories/>}/>

          {/* Acceder a los asientos bancarios de una cuenta */}
          <Route path="/account/:idAccount" element={<ReadEntries />} />

          {/* Mostrar los gráficos de los asientos bancarios de una cuenta */}
          <Route path="/account/:idAccount/graphs" element={<BarChart/>} />

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
