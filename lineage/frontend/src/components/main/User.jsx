export const User = ({ user }) => {
  return (
    <article>
      <p>{user.last_name1} {user.last_name2}, {user.first_name}</p>
      <p>{user.email}</p>
      <form action="#">
        <input type="radio" id="html" name="fav_language" value="HTML"/>
        <label htmlFor="html">HTML</label>
        <input type="radio" id="css" name="fav_language" value="CSS"/>
        <label htmlFor="css">CSS</label>
        <input type="radio" id="javascript" name="fav_language" value="JavaScript"/>
        <label htmlFor="javascript">JavaScript</label>
      </form>
    </article>
  );
};
