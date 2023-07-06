import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";

import ("./css/App.css");

function App() {

  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Login/>}/>
    </Routes>
    </>
  )
}

export default App
