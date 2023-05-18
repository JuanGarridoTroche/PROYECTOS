import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Route, Routes } from "react-router-dom";
import { Users } from "./components/main/Users";
import { RegisterPage } from "./pages/RegisterPage";
import { ValidateUserPage } from "./pages/ValidateUserPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* INICIO */}
          <Route path="/" element={<HomePage />} />

          {/* LISTADO DE USUARIOS */}
          <Route path="/users" element={<Users />} />

          {/* REGISTER */}
          <Route path="/register" element={<RegisterPage />} />

          {/* LOGIN */}
          <Route path="/login" element={<LoginPage />} />

          {/* ACTUALIZAR LOS DATOS DE TU PERFIL */}
          <Route path="/users/profile" element={<UserProfilePage/>} />
          {/* VALIDAR TU USUARIO RECIÉN CREADO CON EL REGISTRATIONCODE QUE TE LLEGA A TU CORREO */}
          <Route
            path="/users/register/validate/:registrationCode"
            element={<ValidateUserPage />}
          />
          <Route path="/users/password/solicitude" element={<RecoverPasswordPage/>} />
          {/* 404 NOT FOUND */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
