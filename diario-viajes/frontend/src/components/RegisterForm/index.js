import "./style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
  // Estados para controlar los inputs del formulario
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Usamos el hook useNavigate, que nos da la función navigate que podemos utilizar para redireccionar al usuario
  const navigate = useNavigate();

  return (
    <form
      className="registerForm"
      onSubmit={async (event) => {
        try {
          // Cancelamos la acción por defecto del formulario
          event.preventDefault();

          // Hacemos una petición POST a la API y enviamos en el body un JSON con los datos que ha introducido el usuario en el formulario. IMPORTANTE mandar el header Content-Type indicando que el body es un JSON
          const res = await fetch("http://localhost:4000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          });

          // Accedemos al body de la respuesta
          const body = await res.json();

          // Si la respuesta viene mal, lanzamos un error con el mensaje que viene en el body
          if (!res.ok) {
            throw new Error(body.message);
          }

          // Redireccionamos al usuario a la página donde se le informa que tiene que validar el email
          navigate("/email/sent");
        } catch (error) {
          // Si salta algún error lo sacamos por consola y se lo mostramos al usuario en una alerta
          console.error(error);
          toast.error(error.message);
        }
      }}
    >
      <label htmlFor="username">Nombre de usuario</label>
      <input
        id="username"
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
        placeholder="username"
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        placeholder="mail@mail.com"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        placeholder="******"
      />

      <button>Registrarse</button>
    </form>
  );
};

export default RegisterForm;
