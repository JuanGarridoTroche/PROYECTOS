import { useState } from "react";

export const Prueba = () => {
  const [data, setData] = useState("");
  const callToJSONService = async () => {
    const response = await fetch('https://www.arborefamiliar.com/prueba.json', {
      headers: {
        'Content-type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  };
  setData(callToJSONService());
  return (
  <>
    <h3>Hola mundo!</h3>;
    <p>{data}</p>
  </>
  )
};
