export const User = ({ user }) => {
  const {first_name, last_name1, last_name2, email, role, active, createdAt} = user;
  return (
    <article>
      <p>Nombre: {first_name} {last_name1} {last_name2}</p>
      <p>Correo electrónico: {email}</p>      
      <p>Rol: {role}</p>
      <p>Cuenta {active ? "activada" : "desactivada"}</p>
      <p>Usuario creado desde {createdAt}</p>
    </article>
  );
};
