import './css/App.css';
import './css/index.css';
import { Routes, Route} from 'react-router-dom';
import { Login } from './pages/Login';
import { Family } from './pages/Family';
import { NotFound } from './pages/NotFound';
import { Form } from './pages/Form';
import { Header } from './components/Header';
import { useContext} from 'react';
import { AuthContext } from './context/AuthContext';
import { UpdateJSON } from './components/UpdateJSON';
import { Administrator } from './components/Administrator';



function App() {
  const {token, logged} = useContext(AuthContext);


  
  return ( 
    <>
      {
        token ? (
          <>
            <Header lineage={logged?.lineage}/>            
          </>
        ) : ( null )
      }     
    <main className={logged?.role === "admin" ? "main-admin" : "main"}>
    {/* {logged?.role === "admin" ? <Aside/>: null} */}
      <Routes> 
          <Route path='/' element={<Login />}/>
          <Route path='/familia/:url' element= {<Family/>} />
          <Route path='/familia/administrator/:url' element={<Administrator/>} />
          <Route path='/familia/administrator/addPDF/:url' element={<UpdateJSON/>} />
          <Route path='/form' element={<Form/>}/>
          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />        
      </Routes>
    </main>     
    </>   
      
  )
}

export default App
