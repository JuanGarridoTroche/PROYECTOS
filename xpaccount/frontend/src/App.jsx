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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { getAccountsUserService, readEntriesByAccountService } from "./services";


function App() {
  const [balance, setBalance] = useState([]);
  const {token} = useContext(AuthContext);
  const [myAccounts, setMyAccounts] = useState([]);
  
  
  useEffect(()=> {
    const myAccountBalance = [];
    const getBalanceData = async () => {   
         
      try {
        // Si el usuario no está logueado no puede eacceder a esta página
        if(!token) {
          navigate("/")
        };
        
        // Obtenemos todas las cuentas bancarias creadas por el usuario logueado
        const getAccounts = await getAccountsUserService(token);
        // console.log("Conseguir cuentas: ", getAccounts);
        if (getAccounts.length > 0) {         
          setMyAccounts(getAccounts);                   
          // Obtener todos los asientos bancarios de cada cuenta creada        
          for(let i=0;i < getAccounts.length;i++) {
            // console.log("bucle for: ", getAccounts[i].id);
            const idAccount = getAccounts[i].id;
            const readingEntries = await readEntriesByAccountService({idAccount, token })
            // console.log(readingEntries); 
            const calculatingBalance = readingEntries.reduce((accumulator, current) => accumulator + parseFloat(current.amount), 0)       
            console.log(calculatingBalance);
            myAccountBalance.push({id: getAccounts[i].id, balance: calculatingBalance})
            console.log(myAccountBalance);
          }
          setBalance(myAccountBalance);
        }
        

      } catch (error) {
        alert(error.message);
      }
    };
    getBalanceData();
  },[])

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
          <Route path="/accounts" element={<Accounts balance={balance}/>} />

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
          <Route path="/account/:idAccount" element={<ReadEntries/>} />

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
