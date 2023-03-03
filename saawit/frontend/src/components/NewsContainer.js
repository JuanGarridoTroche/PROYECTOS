import "../css/LoggedUserContainer.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const NewsContainer = () => {
  const { loggeduser } = useContext(AuthContext);
  return (
    <form className="user-post">
      <Link to={`/users/profile/${loggeduser.id}`}>
        {loggeduser.photo ? (
          <img            
            src={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/${loggeduser.photo}`}
            alt="foto2"
            className="avatar-user"
          />
        ) : null}
      </Link>
      <Link to="/news" className="insert-news">
        <input
          placeholder="Escribe una nueva noticia"
          className="write-new-story"
        />
        <label htmlFor="image">
          <img
            src="/upload-image.svg"
            alt="añade una nueva noticia"
            className="image-upload"
          />
        </label>
        <input type="file" id="image" name="image" multiple />
      </Link>
    </form>
  );
};
