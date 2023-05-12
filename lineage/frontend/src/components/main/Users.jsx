import ('../../css/Users.css')
import { Link } from 'react-router-dom'
import useUsers from '../../hooks/useUsers'
import { UsersList } from './UsersList';
export const Users = ()=> {
  const {users, loading, error} = useUsers();

 
  if(loading) return <p className='p--loading-users-list'>Cargando listado de usuario ⌛...</p>
  // if(error) return <p className='p--error'>{error}</p>

  return (
    <section className="section--users-list">
      <h2 className='section__h2--users-list'>Lista de usuarios registrados</h2>
      <UsersList users={users}/>
      <Link to={"/"} className='section__a--users-list'>Volver al inicio</Link>
    </section>
  )
}