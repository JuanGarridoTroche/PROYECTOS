import NewEntryForm from "../../components/NewEntryForm";
import { useTokenContext } from "../../contexts/TokenContext";
import { Navigate } from "react-router-dom";

const NewEntryPage = () => {
  const { token } = useTokenContext();

  // Si no hay token, redireccionamos a "/login""
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <section>
      <h2>Crea una nueva entrada</h2>

      <NewEntryForm />
    </section>
  );
};

export default NewEntryPage;
