export const User = ({ user }) => {
  console.log(user.email);
  return (
    <article>
      <p>{user.last_name1} {user.last_name2}, {user.first_name}</p>
      <p>{user.email}</p>     

    </article>
  );
};
