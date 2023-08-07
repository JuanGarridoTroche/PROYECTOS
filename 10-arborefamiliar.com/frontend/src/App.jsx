import { Routes, Route} from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { useContext} from "react";
import { AuthContext } from "./contexts/AuthContext";
import { NotFound } from "./pages/NotFound";
import { Family } from "./pages/Family";
import { Form } from "./pages/Form";
import { Prueba } from "./components/Prueba";

import ("./css/App.css");

function App() {
  const {token} = useContext(AuthContext);



  return (
    <>
    {token ? <Header/> : null}
    <main>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/prueba" element={<Prueba/>}/>
        <Route path="/familia/:url" element={<Family/>}/>
        <Route path='/form' element={<Form/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    </>
  )
}

export default App
