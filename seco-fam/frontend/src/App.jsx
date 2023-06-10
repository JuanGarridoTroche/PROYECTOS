import './css/App.css';
import './css/index.css';
import { Routes, Route} from 'react-router-dom';
import { Login } from './pages/Login';
import { Family } from './pages/Family';
import { NotFound } from './pages/NotFound';
import { Form } from './pages/Form';



function App() {
  
  return (
    <>
      <Routes>      
        <Route path='/' element={<Login />}/>
        <Route path='/familia/:url' element= {<Family/>} />
        {/* <Route path='/anca' element={<Family lineage="Anca"/>} />
        <Route path='/cabalar' element={<Family lineage="Cabalar"/>} />
        <Route path='/diaz' element={<Family lineage="Díaz"/>} />
        <Route path='/seco' element={<Family lineage="Seco"/>} />
        <Route path='/administrator' element={<Family lineage="admin"/>} /> */}
        <Route path='/form' element={<Form/>}/>
        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </>
  )
}

export default App
