import "../css/CreateNews.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createNewsService } from "../services";

export const CreateNews = ({ control, setControl }) => {
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const { token } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSending(true);
      const data = new FormData(e.target);
      if (images.length) {
        Array.from(images).forEach((image, index) => {
          data.append(`photo[${index}]`, image);
        });
      }

      await createNewsService({ data, token });
      e.target.reset();
      setImages(null);
      setControl(!control);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <form className="create-news-form" onSubmit={handleSubmit}>
        <h2>Crear una nueva noticia</h2>
        {error ? <label className="error">{error}</label> : null}
        <fieldset className="create-news-container">
          {/* <label id="category">Categoría: </label> */}
          <select name="category" id="category">
            <option value="general" defaultValue>
              Elige una categoría
            </option>
            <option value="deportes">deportes</option>
            <option value="videojuegos">videojuegos</option>
            <option value="noticias">noticias</option>
            <option value="programación">programación</option>
            <option value="viajes">viajes</option>
            <option value="tecnología">tecnología</option>
            <option value="música">música</option>
            <option value="memes">memes</option>
            <option value="general">general</option>
          </select>
          <input
            id="title"
            name="title"
            placeholder="Título"
            className="title"
            required
          />
          <br />
          <input
            id="summary"
            name="summary"
            placeholder="Entradilla (opcional)"
            className="summary"
          />
          <textarea
            id="body"
            name="body"
            rows="5"
            cols="50"
            placeholder="Texto de la noticia..."
            required
          />

          <section className="upload-photos">
            <input
              type="file"
              id="photos"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 3) {
                  return setError("El número máximo de fotos son 3");
                }
                setError("");
                setImages(e.target.files);
              }}
              hidden
              multiple
            />
            {images.length
              ? Array.from(images).map((image, index) => {
                  return (
                    <figure key={index}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        style={{ width: "100px" }}
                      />
                    </figure>
                  );
                })
              : null}
          </section>
          <label htmlFor="photos" className="up-to-3-photos">
              Sube hasta 3 fotos en tu noticia
            </label>
          <label htmlFor="photos">            
            <img
              src="/upload.svg"
              alt="subir imágenes de la noticia"
              className="photos"
            />
          </label>
        </fieldset>
        <button>Enviar</button>
      </form>
      {sending ? <label>Enviando la noticia...</label> : null}
    </>
  );
};
