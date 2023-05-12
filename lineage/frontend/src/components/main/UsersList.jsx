import { User } from "./User";

export const UsersList = ({ users }) => {
  return users.length ? (
    <ul>
      {users.map((user) => {
        <li key={user.id}>
          usuario: <User user={user} />
        </li>;
      })}
    </ul>
  ) : (
    <p>Aún no hay usuarios registrados...</p>
  );
};
