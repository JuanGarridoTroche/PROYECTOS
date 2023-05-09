

export const AuthContext =({children}) => {
  const [tokenLng, setTokenLng] = useState(localStorage.getItem("tokenLng"));
  const [logged, setLogged] = useState(null);

  // Se ejecuta cuando carga el token y sacamos todos los datos del usuario que contiene el tokenLng (id, role, active y email)
}