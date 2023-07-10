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
  const [selectedAddPdf, setSelectedAddPdf] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updatePdfList, setUpdatePdfList] = useState(false);

  useEffect(() => {
    const checkingUser = async () => {
      console.log('entro en el useEffect de Family');
      try {
        if (user?.url !== url && user?.role === 'user') {
          navigate(`/familia/${user?.url}`);
        }

        // Si eres admin o usuario de la familia, devuelve los pdfs
        if (user?.role === 'admin' || user?.url === url) {
          const getUserPdfs = await getFamilyNameAndPdfsService(token, url);
          console.log(getUserPdfs.pdf);
          setPdfs(getUserPdfs.pdf);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (!token) navigate('/');
    console.log(user?.url, updatePdfList);
    token && user?.url && checkingUser();
  }, [token, url, user, updatePdfList]);

  const handleCreatePdf = () => {
    try {
      console.log('Creamos un nuevo pdf para la familia ' + url);
      setShowModal(!showModal);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleDeletePdf = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const familyData = await getFamilyDataByUrlService(token, url);
      await deletePdfService(token, e.target.name, familyData.lineage);
      setUpdatePdfList(!updatePdfList);
      console.log(updatePdfList);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="family">
      <h2 className="family__title">Familia {user?.lineage}</h2>
      {error ? <p>{error}</p> : null}
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
                    <button
                      className="family__pdf-button family__pdf-update"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPdf(index);
                        setShowModal(!showModal);
                      }}
                    >
                      <img className="family__update" alt="imagen" />
                    </button>
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
            <li className="family__pdf-item family__add-pdf">
              <img
                src=""
                alt=""
                className={
                  selectedAddPdf
                    ? 'family__icon-selected-add-pdf'
                    : 'family__icon-add-pdf'
                }
                onClick={handleCreatePdf}
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
          updatePdfList={updatePdfList}
          setUpdatePdfList={setUpdatePdfList}
          pdfToChange={pdfs[selectedPdf]}
          setShowModal={setShowModal}
        ></CreatePdfModal>
      )}
    </section>
  );
};
