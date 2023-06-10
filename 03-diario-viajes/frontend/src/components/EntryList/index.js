import "./style.css";
import { Link } from "react-router-dom";
import Entry from "../Entry";

const EntryList = ({ entries, addVoteToEntry }) => {
  return (
    <ul className="entryList">
      {entries.map((entry) => {
        const {
          id,
          title,
          description,
          place,
          votes,
          createdAt,
          idUser,
          voteByLoggedUser,
        } = entry;

        return (
          <li key={id}>
            <Link to={`/entries/${id}`}>
              <Entry
                id={id}
                title={title}
                description={description}
                place={place}
                votes={votes}
                createdAt={createdAt}
                ownerId={idUser}
                voteByLoggedUser={voteByLoggedUser}
                addVoteToEntry={addVoteToEntry}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default EntryList;
