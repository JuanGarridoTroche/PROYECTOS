import ("../../css/UsersList.css");
import { UserCard } from "./UserCard";

export const UsersList = ({ users }) => {
  
  return users.length ? (
    <ul className="users-list__ul">
      {users.map((user) => {
        return(        
        <li key={user.id} className="users-list__li">
          <UserCard user={user} />
        </li>
        )
      })}
    </ul>
  ) : (
    <p>Aún no hay usuarios registrados...</p>
  );
};
