import './css/App.css';
import './css/index.css';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Family } from './pages/Family';
import { NotFound } from './pages/NotFound';

function App() {

  return (
    <>
      <Routes>      
        <Route path='/' element={<Login />}/>
        <Route path='/Anca' element={<Family lineage="Anca"/>} />
        <Route path='/Cabalar' element={<Family lineage="Cabalar"/>} />
        <Route path='/diaz' element={<Family lineage="Díaz"/>} />
        <Route path='/seco' element={<Family lineage="Seco"/>} />
        <Route path='/seco-admin' element={<Family lineage="admin"/>} />

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </>
  )
}

export default App
