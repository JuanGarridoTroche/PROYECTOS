import { useState } from "react";

export const UpdateEntry = ({entry, idEntry, setIdEntry}) => {
  const [error, setError] = useState("");

  

  return (
    <button
      onClick={() => {
        setIdEntry(entry.id)
      }}
    >
      Editar
    </button>
  );
};
