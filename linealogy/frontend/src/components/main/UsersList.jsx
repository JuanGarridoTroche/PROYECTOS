import { UserCard } from "./UserCard";

export const UsersList = ({ users }) => {
  
  return users.length ? (
    <ul>
      {users.map((user) => {
        return(        
        <li key={user.id}>
          <UserCard user={user} />
        </li>
        )
      })}
    </ul>
  ) : (
    <p>Aún no hay usuarios registrados...</p>
  );
};
