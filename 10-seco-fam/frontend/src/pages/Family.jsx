import('../css/Family.css');
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import { getFamilyNameAndPdfsService } from '../services';

export const Family = () => {
  const { url } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(0);
  const [selectedAddPdf, setSelectedAddPdf] = useState(false);

  useEffect(() => {
    const checkingUser = async () => {
      try {
        if (user?.url !== url && user?.role === 'user') {
          navigate(`/familia/${user?.url}`);
        }

        // Si eres admin o usuario de la familia, devuelve los pdfs
        if (user?.role === 'admin' || user?.url === url) {
          const getUserPdfs = await getFamilyNameAndPdfsService(token, url);
          setPdfs(getUserPdfs.pdf);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (!token) navigate('/');
    token && user?.url && checkingUser();
  }, [navigate, token, url, user]);

  return (
    <section className="family">
      <h2>Familia {user?.lineage}</h2>
      {error ? <p>{error}</p> : null}
      {user?.role === 'admin' ? (
        <ul className="family__pdf-list">
          {pdfs.map((pdf, index) => {
            return (
              <li
                key={index}
                className="family__pdf-item"
                onClick={() => setSelectedPdf(index)}
              >
                <img
                  src=""
                  alt=""
                  className={
                    selectedPdf === index
                      ? 'family__icon-selected'
                      : 'family__icon'
                  }
                />
                <p className="family__pdf-name">{pdf}</p>
                <section className="family__buttons">
                  <button className="family__pdf-button family__pdf-update">
                    Cambiar
                  </button>
                  <button className="family__pdf-button family__pdf-delete">
                    Eliminar
                  </button>
                </section>
              </li>
            );
          })}
          <li className="family__pdf-item family__add-pdf">
            <img
              src=""
              alt=""
              className={
                selectedAddPdf ? 'family__icon-selected-add-pdf' : 'family__icon-add-pdf'
              }
              onClick={()=> setSelectedAddPdf(!selectedAddPdf)}
            />
          </li>
        </ul>
      ) : (
        <ul className="family__pdf-list">
          {pdfs.map((pdf, index) => {
            return (
              <li
                key={index}
                className="family__pdf-item"
                onClick={() => setSelectedPdf(index)}
              >
                <img
                  src=""
                  alt=""
                  className={
                    selectedPdf === index
                      ? 'family__icon-selected'
                      : 'family__icon'
                  }
                />
                <p className="family__pdf-name">{pdf}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
