import { useEffect, useState } from "react";

// El hook useLocalStorage va a crear un estado que se va a guardar automáticamente en la key indicada por parámetro
const useLocalStorage = (key, defaultValue) => {
  // Declaramos el valor inicial que va a tener el estado. Si ya hay algo guardado en el localStorage con la key indicada (por ejemplo "dogFacts"), va a coger ese valor. Si no hay nada guardado en el localStorage, va a coger el defaultValue (un array vacío por ejemplo)
  const initialValue = JSON.parse(localStorage.getItem(key)) || defaultValue;

  // Creamos el estado pasándole el valor inicial anterior (o lo que había en el localStorage o el defaultValue)
  const [data, setData] = useState(initialValue);

  // Cada vez que data cambia, se ejecuta el effect, que guarda en el localStorage el estado (en la key indicada, por ejemplo "dogFacts")
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  // Retorna un array con el estado que se guarda automáticamente en el localStorage y la función para cambiarlo
  return [data, setData];
};

export default useLocalStorage;
