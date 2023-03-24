import "./style.css";
import { useState, useRef } from "react";
import { useTokenContext } from "../../contexts/TokenContext";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import uploadIcon from "../../assets/images/uploadIcon.png";

const NewEntryForm = () => {
  // Estados para controlar los inputs del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");

  // Estado para almacenar el mensaje de error (si es que hay) y mostrarlo por pantalla
  const [errorMessage, setErrorMessage] = useState("");

  // Reference que vinculamos al input de ficheros para poder acceder a él (ya que no podemos controlarlo con un estado)
  const imagesInputRef = useRef();

  // Nos traemos el token del contexto para mandarlo en la petición al crear la nueva entrada
  const { token } = useTokenContext();

  // Usamos el hook useNavigate, que nos da la función navigate que podemos utilizar para redireccionar al usuario
  const navigate = useNavigate();

  return (
    <>
      <form
        className="newEntryForm"
        onSubmit={async (event) => {
          try {
            // Cancelamos la acción por defecto del formulario
            event.preventDefault();

            // Accedemos al input de ficheros con la referencia y nos traemos las imágenes que hay subidas en el input
            const images = imagesInputRef.current.files;

            // Creamos un nuevo FormData para enviar en el body. Siempre que vayamos a enviar ficheros tenemos que mandar un FormData en vez de un JSON
            const formData = new FormData();

            // Metemos en el formData los datos que ha introducido el usuario en el formulario
            formData.set("title", title);
            formData.set("description", description);
            formData.set("place", place);

            // Si ha subido imágenes, hacemos un bucle que añade las imágenes al formData
            if (images.length) {
              for (const image of images) {
                formData.set(image.name, image);
              }
            }

            // Hacemos una petición POST a la API y mandamos el formData en el body. También mandamos el header Authorization con el token
            const res = await fetch("http://localhost:4000/entries", {
              method: "POST",
              headers: {
                Authorization: token,
              },
              body: formData,
            });

            // Accedemos al body de la respuesta
            const body = await res.json();

            // Si la respuesta viene mal, lanzamos un error con el mensaje que viene en el body
            if (!res.ok) {
              throw new Error(body.message);
            }

            // Redireccionamos al usuario a la página principal
            navigate("/");
          } catch (error) {
            // Si salta algún error lo sacamos por consola y metemos el mensaje en el estado errorMessage
            console.error(error);
            setErrorMessage(error.message);
          }
        }}
      >
        <label htmlFor="title">Título:</label>
        <input
          id="title"
          required
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />

        <label htmlFor="description">Descripción:</label>
        <input
          id="description"
          required
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />

        <label htmlFor="place">Lugar:</label>
        <input
          id="place"
          required
          value={place}
          onChange={(event) => {
            setPlace(event.target.value);
          }}
        />

        <label htmlFor="images">
          Sube imágenes:
          <img src={uploadIcon} alt="subir imágenes de la entrada" />
        </label>
        <input
          hidden
          id="images"
          type="file"
          multiple
          accept="image/*"
          ref={imagesInputRef}
        />

        <button>Publicar</button>
      </form>

      {errorMessage && <ErrorMessage msg={errorMessage} />}
    </>
  );
};

export default NewEntryForm;
