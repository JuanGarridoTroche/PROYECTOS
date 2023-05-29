import ("../../css/UserCard.css");

export const UserCard = ({ user }) => {
  const {first_name, last_name1, last_name2, email, role, active, createdAt} = user;
  return (
    <article className="user-card">
      <section className="user-card__section user-card__name name">
        <label className="user-card__label name__label">Nombre: </label>
        <p className="user-card__p name__p">{first_name} {last_name1} {last_name2}</p>
      </section>
      <section className="user-card__section user-card__email email">
        <label className="user-card__label email__label">Correo electrónico: </label>
        <p className="user-card__p email__p">{email}</p>
      </section>
      <section className="user-card__section user-card__role role">
        <label className="user-card__label role__label">Rol: </label>
        <p className="user-card__p role__p">{role}</p>
      </section>
      <section className="user-card__section user-card__active active">
        <label className="user-card__label active__label">Cuenta: </label>
        <p className="user-card__p active__p">{active ? "activada" : "desactivada"}</p>
      </section>   
      <section className="user-card__section user-card__createdAt createdAt">
        <p className="user-card__p createdAt__p"> user-cardUsuario creado el {new Date(createdAt).toLocaleString()}</p>
      </section> 
    </article>
  );
};
