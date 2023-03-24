// Importamos el CSS de App y de react toastify
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Importamos los componentes necesarios de react router dom y react toastify
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Importamos las páginas
import EntriesPage from "./pages/EntriesPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NewEntryPage from "./pages/NewEntryPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmailSentPage from "./pages/EmailSentPage";
import ValidationPage from "./pages/ValidationPage";
import EntryPage from "./pages/EntryPage";
import ProfilePage from "./pages/ProfilePage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<EntriesPage />} />
          <Route path="/entries/:id" element={<EntryPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/entries/new" element={<NewEntryPage />} />
          <Route path="/email/sent" element={<EmailSentPage />} />
          <Route
            path="/validate/:registrationCode"
            element={<ValidationPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/recover/password/:recoverPassCode"
            element={<RecoverPasswordPage />}
          />
          <Route path="*" element={<h2>Not found</h2>} />
        </Routes>
      </main>

      {/* Componente que se encarga de mostrar las alertas lanzadas con la función "toast" */}
      <ToastContainer position="bottom-center" pauseOnHover theme="dark" />

      <Footer />
    </>
  );
}

export default App;
