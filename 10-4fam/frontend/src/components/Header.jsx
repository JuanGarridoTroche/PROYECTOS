import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getAllFamiliyNamesService } from "../services";


export const Header = ()=> {
  const [error, setError] = useState("");
  const {logout, user, token} = useContext(AuthContext);
  const navigate = useNavigate();
  const [familyNames, setFamilyNames] = useState([]);

  
  useEffect(()=> {
    
    const getAllFamilyNames =async()=> {
      try {
        const allFamilyNames = await getAllFamiliyNamesService(token);
        setFamilyNames(allFamilyNames); 
      } catch (err) {
        setError(err.message);
      }
    }
    
    if(user?.role === 'admin') getAllFamilyNames();
  }, [token, user?.role])


  const handleLogout = (e)=> {
    e.preventDefault();
    setError("");
    try {
      logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }
  
  return (
    <header className="menu">
      {error ? <p>{error}</p> : null}
      <section className="menu__brand">
        <Link to={`/familia/${user?.url}`}><img className="menu__logo" src="/logo-admin.svg" alt={user?.lineage}/></Link>
        {user?.role === 'admin' ? null :  <p className="menu__family-name">{user?.lineage}</p>}
      </section>

      {user?.role === 'admin' ? 
        (<nav className="menu__nav">
          <ul className="menu__list">
            {familyNames.map((family)=> {
              return(
              <li key={family.id} className="menu__item"><Link className="menu__item--home menu__item__link" to={`/familia/${family.url}`}>{family.lineage}</Link></li>)
            })}
             <li className="menu__item"><a className="menu__item--logout menu__item__link" href="#" onClick={handleLogout}>salir</a></li>
          </ul>
        </nav>
        ) : (
        <nav className="menu__nav">
          <ul className="menu__list">
            <li className="menu__item"><Link className="menu__item--home menu__item__link" to={`/familia/${user?.url}`}>{user?.lineage}</Link></li>
            <li className="menu__item"><Link className="menu__item--contact menu__item__link" to={"/form"}>contacto</Link></li>
            <li className="menu__item"><a className="menu__item--logout menu__item__link" href="#" onClick={handleLogout}>salir</a></li>
          </ul>
        </nav>
        )
    
    }
      
    </header>
  )
}