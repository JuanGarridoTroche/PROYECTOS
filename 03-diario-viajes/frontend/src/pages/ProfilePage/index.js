import { useTokenContext } from "../../contexts/TokenContext";
import Modal from "../../components/Modal";
import Avatar from "../../components/Avatar";
import getTimeAgo from "../../utils/getTimeAgo";
import { useState } from "react";
import { toast } from "react-toastify";

// Página que muestra el perfil del usuario loggeado. Cuando haces click en el botón "cambiarContraseña", abre un modal preguntando al usuario si quiere cambiarla. Si el usuario acepta, hacemos un fetch al backend para que nos envíe un email con un link para cambiar la pass. Este link nos llevará a la RecoverPasswordPage
const ProfilePage = () => {
  const { loggedUser } = useTokenContext();

  const { email, username, avatar, createdAt } = loggedUser;

  const [showModal, setShowModal] = useState(false);

  return (
    <section>
      <h2>Profile</h2>

      {Object.values(loggedUser).length > 0 && (
        <article>
          <Avatar avatar={avatar} username={username} />
          <h3>{username}</h3>
          <h4>Email: {email}</h4>
          <p>Se unió {getTimeAgo(new Date(createdAt))}</p>
          <button
            onClick={() => {
              setShowModal(true);
            }}
          >
            Cambiar contraseña
          </button>
        </article>
      )}

      {showModal && (
        <Modal setShowModal={setShowModal}>
          <p>
            Se te va a enviar un email con un código para cambiar la contraseña.
            ¿Estás seguro de qué quieres modificarla?
          </p>

          <button
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                const res = await fetch(
                  "http://localhost:4000/users/password/recover",
                  {
                    method: "POST",
                    body: JSON.stringify({ email }),
                    headers: { "Content-Type": "application/json" },
                  }
                );

                const body = await res.json();

                if (!res.ok) {
                  throw new Error(body.message);
                }

                toast.success(body.message);
              } catch (error) {
                console.error(error);
                toast.error(error.message);
              } finally {
                setShowModal(false);
              }
            }}
          >
            Sí, cambiar contraseña
          </button>
        </Modal>
      )}
    </section>
  );
};

export default ProfilePage;
