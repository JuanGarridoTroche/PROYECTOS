import Spinner from "../../components/Spinner";
import EntryList from "../../components/EntryList";
import useEntries from "../../hooks/useEntries";
import ErrorMessage from "../../components/ErrorMessage";
import SearchForm from "../../components/SearchForm";

const EntriesPage = () => {
  const {
    entries,
    errorMessage,
    loading,
    addVoteToEntry,
    searchParams,
    setSearchParams,
  } = useEntries();


  return (
    <section>
      <SearchForm
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <h2>Entradas</h2>

      {loading && <Spinner />}

      {errorMessage && <ErrorMessage msg={errorMessage} />}

      {entries.length > 0 && (
        <EntryList entries={entries} addVoteToEntry={addVoteToEntry} />
      )}
    </section>
  );
};

export default EntriesPage;
