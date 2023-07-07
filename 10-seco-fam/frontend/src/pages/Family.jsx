import('../css/Family.css');
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import { getFamilyNameAndPdfsService } from '../services';
import UpdatePdfModal from "../components/UpdatePdfModal";

export const Family = () => {
  const { url } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(0);
  const [selectedAddPdf, setSelectedAddPdf] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  // const handleUpdate = (e) => {
  //   e.preventDefault();

  //   try {
  //     // console.log(`Sutituyendo el pdf ${pdfs[index]}`);
  //     const formData = new FormData(e.currentTarget);
  //     console.log(formData);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

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
                    <button className="family__pdf-button family__pdf-update" onClick={(e)=> {
                      e.preventDefault();
                      setSelectedPdf(index);
                      setShowModal(!showModal)}}>
                      <img className='family__update' alt='imagen'/>
                    </button>
                    <button className="family__pdf-button family__pdf-delete">
                    <img className='family__delete' alt='imagen'/>
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
                onClick={() => setSelectedAddPdf(!selectedAddPdf)}
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
      <UpdatePdfModal pdfToChange={pdfs[selectedPdf]} setShowModal={setShowModal}>
        
      </UpdatePdfModal>
    )}
    </section>
  );
};
