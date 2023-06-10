import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";

// Página a la que va el usuario cuando hace click en el botón del email para activar su cuenta
const ValidationPage = () => {
  // Recogemos el registrationCode de los params de la url
  const { registrationCode } = useParams();

  // Iniciamos los estados loading y errorMessage
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Nos traemos la función navigate para poder redireccionar al usuario
  const navigate = useNavigate();

  // El useEffect se ejecutará después del primer render
  useEffect(() => {
    const validateUser = async () => {
      try {
        // Cambiamos loading a true mientras hacemos el fetch a la API
        setLoading(true);

        // Hacemos una petición con método PUT al endpoint para activar un usuario. Mandamos el registrationCode por parámetro
        const res = await fetch(
          `http://localhost:4000/users/validate/${registrationCode}`,
          { method: "PUT" }
        );

        // Nos treamos el body de la respuesta
        const body = await res.json();

        // Si la respuesta viene mal, lanzamos un error con el mensaje que viene en el body del back
        if (!res.ok) {
          throw new Error(body.message);
        }

        // Si todo va bien, mostramos una alerta al usuario indicando que está activado y lo redireccionamos a "/login" para que se pueda loguear

        toast.success("¡Has validado tu cuenta correctamente!");
        navigate("/login");
      } catch (error) {
        // Si algo va mal, sacamos el error por consola y metemos el mensaje en el estado errorMessage
        console.error(error);
        setErrorMessage(error.message);
      } finally {
        // Cuando finaliza la función cambiamos loading a false
        setLoading(false);
      }
    };

    validateUser();
  }, [navigate, registrationCode]);

  return (
    <section>
      {errorMessage ? <h2>Error en la validación</h2> : <h2>Validating...</h2>}

      {loading && <Spinner />}

      {errorMessage && <ErrorMessage msg={errorMessage} />}
    </section>
  );
};

export default ValidationPage;
