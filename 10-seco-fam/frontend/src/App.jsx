import { Routes, Route} from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { useContext, useEffect} from "react";
import { AuthContext } from "./contexts/AuthContext";
import { NotFound } from "./pages/NotFound";

import ("./css/App.css");

function App() {
  const {token, user} = useContext(AuthContext);



  return (
    <>
    {token ? <Header/> : null}
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    </>
  )
}

export default App
