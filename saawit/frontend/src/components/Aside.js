import "../css/Aside.css";
import { loadNewsService } from "../services";

export const Aside = ({ setNews }) => {
  const handleCategory = async (e) => {
    try {
      const queryString = `?category=${e.target.textContent}`;

      const newsList = await loadNewsService(queryString);

      // setIsOpen(!isOpen);

      if (newsList) {
        setNews(newsList);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="categories">
      <h2>Categorías</h2>
      <ul
        onClick={(e) => {
          handleCategory(e);
        }}
      >
        <li>deportes</li>
        <li>videojuegos</li>
        <li>noticias</li>
        <li>programación</li>
        <li>viajes</li>
        <li>tecnología</li>
        <li>música</li>
        <li>memes</li>
        <li>general</li>
      </ul>
      
    </section>
  );
};
