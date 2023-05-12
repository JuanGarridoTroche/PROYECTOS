import ('../../css/Users.css')
import { Link } from 'react-router-dom'
export const Users = ()=> {

  return (
    <section className="section--users-list">
      <h2 className='section__h2--users-list'>Lista de usuario registrados</h2>
      <Link to={"/"} className='section__a--users-list'>Volver al inicio</Link>
    </section>
  )
}