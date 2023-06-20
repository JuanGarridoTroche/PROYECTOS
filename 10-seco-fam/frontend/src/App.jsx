import './css/App.css';
import './css/index.css';
import { Routes, Route} from 'react-router-dom';
import { Login } from './pages/Login';
import { Family } from './pages/Family';
import { NotFound } from './pages/NotFound';
import { Form } from './pages/Form';
import { Aside } from './components/Aside';
import { Header } from './components/Header';
import { useContext} from 'react';
import { AuthContext } from './context/AuthContext';
import { Anca } from './components/Anca';



function App() {
  const {token, logged} = useContext(AuthContext);
  
  return (    
    <main>
      {
        token ? (
          <>
            <Header lineage={logged?.lineage}/>
            {logged?.role === "admin" ? <Aside/>: null}
          </>
        ) : ( null )
      }
      
      <Routes> 
          <Route path='/' element={<Login />}/>
          <Route path='/familia/:url' element= {<Family/>} />
          <Route path='/familia/administrator/anca' element={<Anca/>} />
          {/*<Route path='/cabalar' element={<Family lineage="Cabalar"/>} />
          <Route path='/diaz' element={<Family lineage="Díaz"/>} />
          <Route path='/seco' element={<Family lineage="Seco"/>} />
          <Route path='/administrator' element={<Family lineage="admin"/>} /> */}
          <Route path='/form' element={<Form/>}/>
          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />        
      </Routes>
    </main>     
      
  )
}

export default App
