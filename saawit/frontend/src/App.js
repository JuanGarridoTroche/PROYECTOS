import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFoundPage } from "./components/NotFoundPage";
import { Register } from "./pages/Register";
import { ShowNews } from "./components/ShowNews";
import { CreateNews } from "./components/CreateNews";
import { UserProfile } from "./pages/UserProfile";
import { Aside } from "./components/Aside";
import { useEffect, useState } from "react";
import { loadNewsService } from "./services";
import { NewsList } from "./components/NewsList";
import { About } from "./components/About";
import Modal from "./components/Modal";
import { PassCodeSolicitude } from "./pages/PassCodeSolicitude";
import { RecoverPassword } from "./pages/RecoverPassword";

function App() {
  const [news, setNews] = useState();
  const [control, setControl] = useState(false);  

  useEffect(() => {
    const loadNewsBySearch = async () => {
      try {
        const newsList = await loadNewsService();
        if (newsList) {
          setNews(newsList);
        }
      } catch (error) {
        alert(error.message);
      }
    };
    loadNewsBySearch();
  }, [control]);

  return (
    <>
      <Header setNews={setNews} />
      <main>
        <Aside setNews={setNews} />
        <Routes>
          <Route
            path="/"
            element={
              <NewsList
                news={news}
                setNews={setNews}
                control={control}
                setControl={setControl}
              />
            }
          />
          {/* Login de usuario */}
          <Route path="/users/login" element={<Login />} />
          {/* Registro de nuevo usuario */}
          <Route path="/register" element={<Register />} />
          {/* Ver el perfil de un usuario */}
          <Route path="/users/profile/:idUser" element={<UserProfile />} />
          {/* Sobre los autores de la aplicación Saawit */}
          <Route path="/about" element={<About />} />
          {/* Solicitud para que nos envíen a nuestro correo el PassCode para cambiar la contraseña */}
          <Route
            path="/users/password/solicitude"
            element={<PassCodeSolicitude />}
          />
          {/* Recuperación de contraseña (es necesario el Passcode) */}
          <Route path="/users/password/recover" element={<RecoverPassword />} />

          {/* Crear una noticia, método: post */}
          <Route
            path="/news"
            element={<CreateNews control={control} setControl={setControl} />}
          />
          {/* Leer/Editar una noticia, método: get */}
          <Route
            path="/news/:idNews"
            element={<ShowNews control={control} setControl={setControl} />}
          />
          {/* Votar una noticia publicada que no sea de tu propiedad, método: post */}
          <Route path="/news/:idNews/votes" element={<Home />} />
          <Route
            path="*"
            element={
              <Modal>
                <NotFoundPage />
              </Modal>
            }
          />
        </Routes>
        {/* <NewsList /> */}
      </main>
      <Footer />
    </>
  );
}

export default App;
