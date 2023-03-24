import "./style.css";
import { Link, NavLink } from "react-router-dom";
import { useTokenContext } from "../../contexts/TokenContext";
import Avatar from "../Avatar";

const Header = () => {
  const { token, setToken, loggedUser } = useTokenContext();

  const { username, avatar } = loggedUser;

  return (
    <header>
      <Link to="/">
        <img src="http://localhost:3000/favicon.ico" alt="app logo" />
      </Link>

      <Link to="/">
        <h1>Diario de viajes</h1>
      </Link>

      <nav>
        <ul>
          {/* Si no hay token, pintamos los enlaces a registro y login */}
          {!token && (
            <>
              <li>
                <NavLink to="/register">Registro</NavLink>
              </li>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            </>
          )}

          {/* Si hay token, pintamos el enlace a nueva entrada y al botón de logout */}
          {token && (
            <>
              <li>
                <NavLink to="/entries/new">Nueva entrada</NavLink>
              </li>
              <li>
                <NavLink to="/profile">
                  <Avatar avatar={avatar} username={username} />
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    setToken("");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
