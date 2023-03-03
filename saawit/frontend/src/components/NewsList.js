import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { News } from "./News";
import { NewsContainer } from "./NewsContainer";


export const NewsList = ({ news, setNews, control, setControl }) => {
  const [order, setOrder] = useState("createdAt");
  const [direction, setDirection] = useState("ASC");
  const { loggeduser} = useContext(AuthContext);  

  const filterNews = (e) => {
    e.stopPropagation();

    let filteredNews;

    if (order === "votes" && direction === "ASC") {
      filteredNews = news.sort((a, b) => a.totalVotes - b.totalVotes);
    } else if (order === "votes" && direction === "DESC") {
      filteredNews = news.sort((a, b) => b.totalVotes - a.totalVotes);
    } else if (order === "createdAt" && direction === "ASC") {
      filteredNews = news.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else {
      filteredNews = news.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    
    setNews([...filteredNews]);
  };


  // Filtro de las noticias mejor valoradas del día de hoy
  const filterNewsBestVote = (e) => {
    const todayNews = news.filter((e) => {
      const day = new Date().toLocaleString().slice(0, 10);
      let mySQLFormattedDate = new Date(e.createdAt).toLocaleString().slice(0, 10); 
      return (mySQLFormattedDate) === day;
    });
    todayNews.sort((a, b) => b.totalVotes - a.totalVotes);

    setNews([...todayNews]);
  };

  return (
    <section className="breaking-news" id="up">
      {loggeduser ? <NewsContainer /> : null}
      <h2>Últimas noticias</h2>
      <div className="filter-container">
        <label
          className="best-vote"
          onClick={() => {
            filterNewsBestVote();
          }}
        >
          <img src="/rocket-best-vote.svg" alt="noticias más votadas hoy" />
          <p>HOY</p>
        </label>
        <label htmlFor="order"></label>
        <select
          id="order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="order"
        >
          <option value="createdAt">Fecha</option>
          <option value="votes">Valoración</option>
        </select>
        <label htmlFor="direction"></label>
        <select
          id="direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="direction"
        >
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
        </select>
      <button onClick={filterNews} className="filter">
        Filtrar
      </button>
      </div>
      <button
        id="up"
        onClick={() => {
          // Para Chrome, Firefox, IE y Opera
          document.documentElement.scrollTop = 0;

          // Para Safari
          document.body.scrollTop = 0;
        }}
      >
        Volver arriba
      </button>
      {news ? (
        <ul className="news-list filter">                    
          {news.map((singleNews) => {
            return (
              <li key={singleNews.id} className="single-news">
                <News news={singleNews} control={control} setControl={setControl} />
              </li>
            );
          })}
        </ul>
      ) : (
        <h2>No hay noticias disponibles</h2>
      )}
    </section>
  );
};
