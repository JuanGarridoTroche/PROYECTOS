import "./style.css";
import getTimeAgo from "../../utils/getTimeAgo";
import EntryVotesStars from "../EntryVotesStars";
import EntryPhotos from "../EntryPhotos";
import Modal from "../Modal";
import { useTokenContext } from "../../contexts/TokenContext";
import { useState } from "react";

const Entry = ({
  id,
  title,
  description,
  place,
  votes,
  ownerId,
  createdAt,
  photos,
  voteByLoggedUser,
  addVoteToEntry,
}) => {
  const { token, loggedUser } = useTokenContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <article className="entry">
      <header>
        <h3>{title}</h3>
        <h4>{place}</h4>
      </header>

      <p>{description}</p>

      {photos?.length > 0 && <EntryPhotos photos={photos} title={title} />}

      <footer>
        <section className="entryVotes">
          <p>{parseFloat(votes).toFixed(2)}</p>{" "}
          {<EntryVotesStars votes={votes} />}
        </section>
        <span>·</span>
        <p className="entryDateAuthor">
          Publicado por <span>usuario {ownerId} </span>
          {getTimeAgo(new Date(createdAt))}
        </p>

        {token && loggedUser.id !== ownerId && (
          <>
            <span>·</span>
            {!voteByLoggedUser ? 
            <button
              onClick={(event) => {
                event.preventDefault();

                setShowModal(true);
              }}
            >
             Votar
            </button> : 'Votado'}
          </>
        )}
      </footer>

      {showModal && (
        <Modal setShowModal={setShowModal}>
          {!voteByLoggedUser ? (
            <p>Escoge la puntuación que le quieres dar a la entrada:</p>
          ) : (
            <p>Has dado esta puntuación:</p>
          )}

          <EntryVotesStars
            votes={voteByLoggedUser}
            entryId={id}
            addVoteToEntry={addVoteToEntry}
          />
        </Modal>
      )}
    </article>
  );
};

export default Entry;
