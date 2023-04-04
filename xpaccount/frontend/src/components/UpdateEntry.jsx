import { useState } from "react";

export const UpdateEntry = ({entry, setIdEntry, recoverEntries, setRecoverEntries}) => {
  const [error, setError] = useState("");
  console.log(recoverEntries);
  

  return (
    <button
      onClick={() => {
        setIdEntry(entry.id)
        setRecoverEntries(!recoverEntries)
      }}
    >
      Editar
    </button>
  );
};
