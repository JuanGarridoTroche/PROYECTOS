import "../css/UserProfile.css";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage";
import useUserProfile from "../hooks/useUserProfile";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { editUserProfile } from "../services";

export const UserProfile = () => {
  const { idUser } = useParams();
  const { user, loading, error } = useUserProfile(idUser);
  const { loggeduser, setLoggedUser, token } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("username", username);
    formData.set("email", email);
    formData.set("bio", bio);
    formData.set("photo", avatar);

    const editedValues = await editUserProfile({ formData, token });

    setLoggedUser({
      ...loggeduser,
      username: editedValues.username,
      email: editedValues.email,
      bio: editedValues.bio,
      photo: editedValues.photo,
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="user-profile">
      <h2 className="profile">
        Perfil de usuario {user.active ? "activo" : <span>desactivado</span>}
      </h2>
      {token && loggeduser && loggeduser.id === user.id ? (
        <form className="user-profile-form" onSubmit={handleSubmit}>
          <fieldset>
            <h3>Nombre de usuario:</h3>
            <label htmlFor="username" className="summary">
              Escribe un nombre de usuario
            </label>
              <input
                id="username"
                value={username}
                placeholder={user.username}
                onChange={(e) => setUsername(e.target.value)}
              />
              
          </fieldset>
          <fieldset>
            <h3>Correo electrónico:</h3>
            <label htmlFor="email" className="summary">
              Escribe un correo electrónico válido
            </label>
            <section>
              <input
                id="email"
                value={email}
                placeholder={user.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Link to="/users/password/solicitude" className="change-password">Cambiar contraseña</Link>
            </section>
          </fieldset>
          <fieldset>
            <h3>Sobre mi:</h3>
            <label htmlFor="bio" className="summary">
              Una breve descripción sobre ti mismo para mostrar en tu perfil
            </label>
            <textarea
              id="bio"
              defaultValue={user.bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </fieldset>
          <fieldset>
            <h3>Avatar:</h3>
            <label className="summary">
              La imagen debe tener extensión jpg, jpeg, png, gif, bmp, raw o
              webp con un formato cuadrado
            </label>

            <label htmlFor="avatar">
              {user.photo ? (
                <img
                  src={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/${user.photo}`}
                  alt="subir imágenes de la entrada"
                  className="avatar"
                />
              ) : (
                <img
                  src="/upload.svg"
                  alt="subir imágenes de la noticia"
                  className="photos"
                />
              )}
            </label>

            <input
              hidden
              id="avatar"
              name="avatar"
              type="file"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </fieldset>
          <fieldset>
            <h3>Rol:</h3>
            <label>{<span>{user.role}</span>}</label>
          </fieldset>
          <fieldset>
            <h3>Cuenta creada:</h3>
            <label>
              {<span>{new Date(user.createdAt).toLocaleDateString()}</span>}
            </label>
          </fieldset>
          <button>Actualizar</button>
        </form>
      ) : (
        <form className="user-profile-form">
          <fieldset>
            <h3>Nombre de usuario:</h3>
            <label>{<span>{user.username}</span>}</label>
          </fieldset>
          <fieldset>
            <h3>Cuenta de correo:</h3>
            <label>{<span>{user.email}</span>}</label>
          </fieldset>
          <fieldset>
            <h3>Sobre mi:</h3>
            <label>{<span>{user.bio}</span>}</label>
          </fieldset>
          <fieldset>
            <h3>Avatar:</h3>
            {user.photo ? (
              <img
                src={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/${user.photo}`}
                alt="avatar"
                style={{ width: "25px" }}
                className="avatar"
              />
            ) : (
              "Sin avatar"
            )}
          </fieldset>
          <fieldset>
            <h3>Rol:</h3>
            <label>{<span>{user.role}</span>}</label>
          </fieldset>
          <fieldset>
            <label>
              <h3>Cuenta creada:</h3>
              {<span>{new Date(user.createdAt).toLocaleDateString()}</span>}
            </label>
          </fieldset>
          {/* <fieldset>
            <h3>Cuenta:</h3>
            { user.active ? null :
              <label className="summary">Solicita la activación de tu cuenta a través del envío de una solicitud a tu correo electrónico</label>}            
            <label>              
              <span>{user.active ? "Activa" : "suspendida"}</span>
            </label>
          </fieldset> */}
        </form>
      )}
    </section>
  );
};
