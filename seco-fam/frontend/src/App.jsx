import './css/App.css';
import './css/index.css';
import { Routes, Route } from 'react-router-dom';
import { Main } from './pages/Main';

function App() {

  return (
    <>
      <h1 className="main__title">Web de Seco</h1>
      <Routes>
        <Route path='/' element={<Main />}/>
      </Routes>
      
    </>
  )
}

export default App
