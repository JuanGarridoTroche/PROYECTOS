import { User } from "./User";

export const UsersList = ({ users }) => {
  
  return users.length ? (
    <ul>
      {users.map((user) => {
        return(        
        <li key={user.id}>
          <User user={user} />
        </li>
        )
      })}
    </ul>
  ) : (
    <p>Aún no hay usuarios registrados...</p>
  );
};
