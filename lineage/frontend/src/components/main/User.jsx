

export const User = ({user})=> {

  console.log(user.email);
  return (
    <article>
      <p>{user.email}</p>
    </article>
  )
}