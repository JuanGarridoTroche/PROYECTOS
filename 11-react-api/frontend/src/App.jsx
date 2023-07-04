import { useEffect, useState } from "react";

 

function App() {
  const [number, setNumber] = useState(10);
  const [pokemonNumber, setPokemonNumber] = useState(1);
  const [name, setName] = useState("");

  useEffect(()=> {
    // Aquí tendremos el valor actualizado del hook de estado number
   console.log('Valor al actualizar el estado: ' + number); 

   // Hay que llamar a la API para tener el valor actualizado correcto

  }, [number])

  useEffect(()=> {
    // Aquí tendremos el valor actualizado del hook de estado number
   console.log('Valor al actualizar el estado: ' + pokemonNumber); 

   // Hay que llamar a la API para tener el valor actualizado correcto
   // Si utilizamos promesas:
  //  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
  //  .then((result)=> result.json()
  //  .then(data=> setName(data.name)))

    searchPokemon(pokemonNumber);

  }, [pokemonNumber])

  const searchPokemon = async(pokemonNumber)=> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
    const data = await response.json();
    if(!response.ok) {
      console.error("Error")
    }

    setName(data.name);

    
  }

  const increasePokemonNumber = ()=> {
    // Aquí tendremos el valor anterior del hook de estado number
    setPokemonNumber(pokemonNumber + 1);
    console.log("Valor antes del nuevo render: " + pokemonNumber);
  }

  const increaseNumber = ()=> {
    // Aquí tendremos el valor anterior del hook de estado number
    setNumber(number + 1);
    console.log("Valor antes del nuevo render: " + number);
  }


  return (
    <>
    <button onClick={increaseNumber}>Siguiente</button>
    <p>{number}</p>
    <section>
    <button onClick={increasePokemonNumber}>Siguiente</button>
    <p>{pokemonNumber} - {name}</p>    
    </section>
    </>
  )
}

export default App
