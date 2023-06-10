import useNews from "../hooks/useNews";
import { NewsList } from "../components/NewsList";
import { ErrorMessage } from "../components/ErrorMessage";

export const NewsByFeedback_BORRAR = () => {
  const { news, loading, error } = useNews('byFeedback');

  if (loading) return <p>Cargando noticias...</p>;
  if (error) return <ErrorMessage message={error} />;

  return <NewsList news={news} />;
};
