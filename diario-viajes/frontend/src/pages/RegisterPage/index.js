import RegisterForm from "../../components/RegisterForm";
import { useTokenContext } from "../../contexts/TokenContext";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const { token } = useTokenContext();

  // Si el user ya está logueado, redireccionamos a inicio
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <section>
      <h2>Registro</h2>

      <RegisterForm />
    </section>
  );
};

export default RegisterPage;
