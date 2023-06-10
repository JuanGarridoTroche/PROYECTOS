import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLocalStorage from "../hooks/useLocalStorage";

// Creamos un contexto para hacer el token accesible a todos los componentes de la App. El TokenContext tiene una propiedad .Provider que es un componente. A este componente hay que pasarle la prop value con el valor que queramos y todos los componentes hijos de él van a tener acceso a dicho valor
export const TokenContext = createContext();

// Creamos un componente que crea un estado para el token y pinta el Provider pasándole como valor el token y la función para cambiarlo. A este componente le pasaremos por la prop children el componente "App" para que todos nuestros componentes tengan acceso al value del Provider (ver index.js)
export const CustomTokenContextProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", "");
  const [loggedUser, setLoggedUser] = useState({});

  const navigate = useNavigate();

  // useEffect que se ejecuta después del primer render y cada vez que el token cambia
  useEffect(() => {
    // Si el token no existe, cambiamos loggedUser a un objeto vacío y cortamos la función
    if (!token) {
      setLoggedUser({});
      return;
    }

    // Si el token existe, recogemos la información del usuario de la API y metemos los datos en el estado loggedUser
    const fetchUserProfile = async () => {
      try {
        const tokenEncryptedPayload = token.split(".")[1];

        const tokenPayload = JSON.parse(atob(tokenEncryptedPayload));

        const res = await fetch(
          `http://localhost:4000/users/${tokenPayload.id}`,
          {
            headers: { Authorization: token },
          }
        );

        const body = await res.json();

        if (!res.ok) {
          throw new Error(body.message);
        }

        setLoggedUser({ ...body.data.user, id: tokenPayload.id });
      } catch (error) {
        // Si hay algún error cargando los datos del usuario logueado (por ejemplo, porque el token caducó) le lanzamos una alerta de que hubo un error al iniciar sesión, lo deslogueamos y lo redirigimos a login
        console.error(error);
        toast.error("Hubo un error en el login. Porfavor, inténtalo de nuevo");
        setToken("");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [token, navigate, setToken]);

  return (
    <TokenContext.Provider
      value={{ token, setToken, loggedUser, setLoggedUser }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  return useContext(TokenContext);
};

// export { TokenContext, CustomTokenContextProvider };
