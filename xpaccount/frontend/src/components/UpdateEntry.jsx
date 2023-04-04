import { useState } from "react";

export const UpdateEntry = ({entry}) => {
  const [error, setError] = useState("");
  // console.log(entry);

  const handleUpdateEntry = async () => {
    setError("");

    try {
      alert("Editar asiento bancario");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <button
      onClick={() => {
        handleUpdateEntry();
      }}
    >
      Editar
    </button>
  );
};
