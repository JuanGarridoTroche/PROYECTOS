import LoginForm from "../../components/LoginForm";
import { useTokenContext } from "../../contexts/TokenContext";
import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

const LoginPage = () => {
  const { token } = useTokenContext();

  // La función navigate solo se puede utilizar en enventos o useEffect, así que si queremos redireccionar antes del primer render, tendremos que usar el compontente Navigate

  // Así redireccionaríamos utilizando la función navigate en un useEffect:

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     navigate("/");
  //   }
  // }, []);

  // Así redireccionamos usando el componente Navigate:

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <section>
      <h2>Login</h2>

      <LoginForm />
    </section>
  );
};

export default LoginPage;
