import { useState, useEffect } from "react";
import { useTokenContext } from "../contexts/TokenContext";
import { useSearchParams } from "react-router-dom";

// El custom hook useEntries carga las entries de la API y nos retorna un objeto con las entries, loading y errorMessage
const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const addVoteToEntry = ({ id, newAvg, voteByLoggedUser }) => {
    console.log("addVoteToEntry como entra el dato: ", entries);
    const index = entries.findIndex((entry) => entry.id === id);

    entries[index].voteByLoggedUser = voteByLoggedUser;
    entries[index].votes = newAvg;

    setEntries([...entries]);
    console.log("addVoteToEntry después del setEntries: ", entries);
  };

  const { token } = useTokenContext();

  // El effect se ejecuta después del primer render
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Cuando empezamos a hacer el fetch, cambiamos el estado loading a true
        setLoading(true);

        // Hacemos el fetch y recogemos la respuesta del servidor
        const res = await fetch(
          `http://localhost:4000/entries?${searchParams.toString()}`,
          {
            headers: token ? { Authorization: token } : {},
          }
        );

        // Nos traemos el body de la respuesta
        const body = await res.json();

        // Si la respuesta no viene bien, lanzamos un error con el mensaje que viene de la API
        if (!res.ok) {
          throw new Error(body.message);
        }

        // Cargamos los datos de las entries en el estado de entries
        setEntries(body.data.entries);
      } catch (error) {
        // Si salta algún error, metemos el mensaje en el estado errorMessage
        setErrorMessage(error.message);
      } finally {
        // Al finalizar el fetch, cambiamos loading a false
        setLoading(false);
      }
    };

    fetchEntries();
  }, [searchParams, token]);

  return {
    entries,
    errorMessage,
    loading,
    addVoteToEntry,
    searchParams,
    setSearchParams,
  };
};

export default useEntries;
