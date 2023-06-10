import { Link, useParams } from "react-router-dom";
import Entry from "../../components/Entry";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import useEntryById from "../../hooks/useEntryById";

// Página que carga una sola entry
const EntryPage = () => {
  // Recogemos el id de los params de la url
  const { id } = useParams();

  // Llamamos al custom hook useEntryById y le pasamos el id que hemos recogido de los params. Este hook se va a encargar de crear los estados entry, loading y errorMessage y un useEffect que carge los datos de la API después del primer render
  const { entry, loading, errorMessage, addVoteToEntry } = useEntryById(id);

  // Hacemos destructuring del objeto entry
  const {
    title,
    description,
    place,
    votes,
    idUser,
    createdAt,
    photos,
    voteByLoggedUser,
  } = entry;

  return (
    <section>
      <h2>Entry page</h2>

      {/* Si hay mensaje de error, pintamos el componente ErrorMessage y un link
      para volver a inicio */}
      {errorMessage && (
        <>
          <ErrorMessage msg={errorMessage} />
          <Link to="/">Volver a inicio</Link>
        </>
      )}
      {loading && <Spinner />}

      {/* Si el objeto entry no está vacío, pintamos el componente Entry con todos los datos del objeto */}
      {Object.values(entry).length > 0 && (
        <Entry
          id={id}
          title={title}
          description={description}
          place={place}
          votes={votes}
          ownerId={idUser}
          createdAt={createdAt}
          photos={photos}
          voteByLoggedUser={voteByLoggedUser}
          addVoteToEntry={addVoteToEntry}
        />
      )}
    </section>
  );
};

export default EntryPage;
