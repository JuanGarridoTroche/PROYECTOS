import './css/App.css';
import './css/index.css';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Family } from './pages/Family';
import { NotFound } from './pages/NotFound';



function App() {
  // const [lineage, setLineage] = useState("");
  // const {token, logged} = useContext(AuthContext);
  // let {url} = useParams();
  // const navigate = useNavigate();
  // console.log(url);

  // useEffect(()=> {
  //   const checkingToken = async()=> {
  //     setLineage(logged?.lineage);
  //   }

  //   if(!token) navigate("/");
  //   checkingToken();
  // }, [token, navigate, logged?.lineage])

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

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </>
  )
}

export default App
