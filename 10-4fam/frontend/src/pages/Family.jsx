import('../css/Family.css');
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import {
  deletePdfService,
  getFamilyDataByUrlService,
  getFamilyNameAndPdfsService,
} from '../services';
import CreatePdfModal from '../components/CreatePdfModal';

export const Family = () => {
  const { url } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkingUser = async () => {
      try {
        if (user?.url !== url && user?.role === 'user') {
          navigate(`/familia/${user?.url}`);
        }

        // Si eres admin o usuario de la familia, devuelve los pdfs
        const getUserPdfs = await getFamilyNameAndPdfsService(token, url);
       
        setPdfs(getUserPdfs.pdf);  


      } catch (error) {
        setError(error.message);
      }
    };

    if (!token) navigate('/');
    token && user?.url && checkingUser();
  }, [token, url, user, navigate]);

 
  const handleCreatePdf = () => {
    try {
      setShowModal(!showModal);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeletePdf = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const familyData = await getFamilyDataByUrlService(token, url);
      const deletePdf = await deletePdfService(token, e.target.name, familyData.lineage);      
      const newData = {};
      for(let family of deletePdf) {
        if(family.url === url) {
          newData.lineage = family.lineage;
          newData.pdf = family.pdf;
        }
      }
      setPdfs(newData.pdf); 
      setSelectedPdf(0);      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="family">
      <h2 className="family__title">Familia {user?.lineage}</h2>
      {error ? <p className='error'>{error}</p> : null}
      <section className="family__pdfs">
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
                    className={
                      selectedPdf === index
                        ? 'family__icon-selected'
                        : 'family__icon'
                    }
                  />
                  <p className="family__pdf-name">{pdf}</p>
                  <section className="family__buttons">
                    {/* <button
                      className="family__pdf-button family__pdf-update"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPdf(index);
                        setShowModal(!showModal);
                      }}
                    >
                      <img className="family__update" alt="imagen" />
                    </button> */}
                    <button className="family__pdf-button family__pdf-delete">
                      <img
                        name={pdf}
                        className="family__delete"
                        alt="imagen"
                        onClick={(e) => handleDeletePdf(e)}
                      />
                    </button>
                  </section>
                </li>
              );
            })}
            {url !== 'administrator' ? (
              <li className="family__pdf-item family__add-pdf">
                <img
                  src=""
                  alt=""
                  className='family__icon-add-pdf'
                  onClick={handleCreatePdf}
                />
              </li>
            ) : null}
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
      <section className="family__selected-pdf">
        {pdfs.length > 0 ? (
          <embed
            src={`${import.meta.env.VITE_BACKEND_URL}:${
              import.meta.env.VITE_BACKEND_PORT
            }/static/data/${url}/${pdfs[selectedPdf]}`}
            type="application/pdf"
            className="pdf__embed"
            width="100%"
            height="100%"
          />
        ) : null}
      </section>
      {showModal && (
        <CreatePdfModal
          setPdfs={setPdfs}
          setShowModal={setShowModal}
          setSelectedPdf={setSelectedPdf}
        ></CreatePdfModal>
      )}
    </section>
  );
};
