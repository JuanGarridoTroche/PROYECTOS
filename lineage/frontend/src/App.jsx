import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Route, Routes } from "react-router-dom";
import { Users } from "./components/main/Users";
import { RegisterPage } from "./pages/RegisterPage";
import { ValidateUserPage } from "./pages/ValidateUserPage";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* INICIO */}
          <Route path="/" element={<HomePage />} />

          {/* LOGIN */}
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/users/register/validate/:registrationCode"
            element={<ValidateUserPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
