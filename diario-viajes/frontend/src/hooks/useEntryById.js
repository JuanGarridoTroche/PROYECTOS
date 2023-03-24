import { useState, useEffect } from "react";
import { useTokenContext } from "../contexts/TokenContext";

const useEntryById = (id) => {
  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { token } = useTokenContext();

  const addVoteToEntry = ({ newAvg, voteByLoggedUser }) => {
    entry.voteByLoggedUser = voteByLoggedUser;
    entry.votes = newAvg;

    setEntry({ ...entry });
  };

  useEffect(() => {
    const fetchEntryById = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/entries/${id}`, {
          headers: token ? { Authorization: token } : {},
        });

        const body = await res.json();

        if (!res.ok) {
          throw new Error(body.message);
        }

        setEntry(body.data.entry);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntryById();
  }, [id, token]);

  return { entry, loading, errorMessage, addVoteToEntry };
};

export default useEntryById;
