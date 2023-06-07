import './css/App.css';
import './css/index.css';
import { Routes, Route } from 'react-router-dom';
import { Main } from './pages/Main';
import { Family } from './pages/Family';

function App() {

  return (
    <>
      <Routes>      
        <Route path='/' element={<Main />}/>
        <Route path='/troche' element={<Family lineage="Troche"/>} />
        <Route path='/bermudez' element={<Family lineage="Bermúdez"/>} />
        <Route path='/duran' element={<Family lineage="Durán"/>} />
        <Route path='/seco' element={<Family lineage="Seco"/>} />
        <Route path='/seco-admin' element={<Family lineage="admin"/>} />
      </Routes>
      
    </>
  )
}

export default App
