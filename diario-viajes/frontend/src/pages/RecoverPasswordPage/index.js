import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTokenContext } from "../../contexts/TokenContext";

// Página que recoge el recoverPassCode de los parámetros de la url y hace un fetch al back con la nueva contraseña que meta el usuario en el formulario
const RecoverPasswordPage = () => {
  // Recogemos el recoverPassCode de los parámetros de la url
  const { recoverPassCode } = useParams();

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const navigate = useNavigate();

  const { setToken } = useTokenContext();

  return (
    <section>
      <h2>Recuperación de contraseña</h2>

      <form
        onSubmit={async (event) => {
          try {
            event.preventDefault();

            if (password !== repeatedPassword) {
              throw new Error("Las contraseñas no coinciden");
            }

            const res = await fetch("http://localhost:4000/users/password", {
              method: "PUT",
              body: JSON.stringify({
                recoverPassCode,
                password,
                repeatedPassword,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const body = await res.json();

            if (!res.ok) {
              throw new Error(body.message);
            }

            // Si el back no da ningún error, deslogueamos al usuario, le avisamos de que su contraseña ha cambiado y lo redirigimos a login
            setToken("");
            toast.success("¡Contraseña actualizada con éxito!");
            navigate("/login");
          } catch (error) {
            console.error(error);
            toast.error(error.message);
          }
        }}
      >
        <label htmlFor="password">Nueva contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <label htmlFor="repeatedPassword">Repetir nueva contraseña:</label>
        <input
          type="password"
          id="repeatedPassword"
          value={repeatedPassword}
          onChange={(event) => {
            setRepeatedPassword(event.target.value);
          }}
        />

        <button>Cambiar contraseña</button>
      </form>
    </section>
  );
};

export default RecoverPasswordPage;
