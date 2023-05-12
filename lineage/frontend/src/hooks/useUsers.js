import { useEffect, useState } from "react";
import { loadUsersService } from "../services";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const users = await loadUsersService();
        setUsers(users);
        // console.log(users);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return { users, loading, error };
};

export default useUsers;
