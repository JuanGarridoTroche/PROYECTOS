import ("../css/NotFound.css")
export const NotFound =()=> {

  return(
    <section className="not-found">
      <h2 className="not-found-text">Página no encontrada</h2>
      <img src="/404.png" alt="página no encontrada" className="img-not-found"/>
    </section>
  )
}