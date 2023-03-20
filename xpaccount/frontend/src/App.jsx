import ("./css/Main.css")
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
// import {Accounts, Footer, Header, Home, Login, Main, Register } from "./pages"
import { Home } from "./components/Home";
import { Accounts } from "./pages/Accounts";
import { Footer } from "./pages/Footer";
import { Header } from "./pages/Header";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";

import ("./css/style.css")

function App() {

  useEffect(()=> {

  }, [])
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
        <Route path="/accounts" element={<Accounts/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    <Footer />
  </>
  );
}

export default App;

