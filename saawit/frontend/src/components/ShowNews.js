import "../css/ShowNews.css";
import { useNavigate, useParams } from "react-router-dom";
import { editNewsService, newsService } from "../services";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";

export const ShowNews = ({ control, setControl }) => {
  const { idNews: id } = useParams();
  const { loggeduser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [news, setNews] = useState({});
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const method = "GET";

  useEffect(() => {
    const getNewsById = async () => {
      try {
        const currentNews = await newsService({ id, token, method });
        setNews(currentNews);
        setCategory(currentNews.category);
        setTitle(currentNews.title);
        setSummary(currentNews.summary);
        setBody(currentNews.body);
      } catch (err) {
        setError(err.message);
      }
    };

    getNewsById();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSending(true);

      const formData = new FormData();

      formData.append("category", category);
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("body", body);

      if (images.length) {
        Array.from(images).forEach((image, index) => {
          formData.append(`photo[${index}]`, image);
        });
      }

      const editedValues = await editNewsService(formData, id, token);

      // Modificamos la noticia con la nueva info.
      setNews({
        ...news,
        category: editedValues.category,
        title: editedValues.title,
        summary: editedValues.summary,
        body: editedValues.body,
      });
      setControl(!control);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="edit-news-form" onSubmit={handleSubmit}>
      {error ? <label className="error">{error}</label> : null}
      {token && news.idUser === loggeduser?.id ? (
        <h2>Editar noticia</h2>
      ) : (
        <h2>Ver noticia</h2>
      )}
      <fieldset className="edit-news-container">
        <select
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled defaultValue>
            {news.category}
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
          placeholder={news.title}
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          id="summary"
          placeholder={news.summary ? news.summary : "Entradilla (opcional)"}
          className="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <textarea
          id="body"
          rows="5"
          cols="50"
          value={body}
          placeholder={news.body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <section className="show-photos">
          {news.photoNews?.length && !images.length
            ? news.photoNews.map((photo) => {
                return (
                  <figure key={photo.id}>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/${photo.name}`}
                      alt="preview"
                      style={{ width: "100px" }}
                    />
                  </figure>
                );
              })
            : null}
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
        {token && news.idUser === loggeduser?.id ?
          <section className="photos-news">
          {news.photoNews?.length ? (
            <>
              <label htmlFor="photos">
                <img
                  src="/upload.svg"
                  alt="subir imágenes de la noticia"
                  className="photos"
                />
              </label>
              <input
                type="file"
                id="photos"
                onChange={(e) => setImages(e.target.files)}
                hidden
                multiple
              />
            </>
          ) : null}
        </section>
        : null}
      </fieldset>

      {/* <fieldset>{news.photoNews ? "" : <p>No hay fotos subidas</p>}</fieldset> */}

      {token && news.idUser === loggeduser?.id ? (
        <button disabled={sending}>Enviar</button>
      ) : null}
    </form>
  );
};
