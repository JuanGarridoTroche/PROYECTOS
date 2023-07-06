import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../contexts/AuthContext";


export const Family = ()=> {
  const {url} = useParams();
  const [error, setError] = useState("");
  const {token, user} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=> {
    const checkingToken = async()=> {
      try {
        if(user?.url !== url) {
          navigate(`/familia/${user?.url}`);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    if(!token) navigate("/");
    token && user?.url && checkingToken();
  }, [navigate, token, url, user])


  return (
    <section className="family">
      <h2>Familia</h2>
      {error ? <p>{error}</p> : null}
    </section>
  )
}