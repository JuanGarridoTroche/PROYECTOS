

// Muestra los datos del usuario logueado (id, lineage, active y pdf) 
// a partir del token guardado en el almacenamiento local de su navegador
export const getLoggedUserDataService = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/loggedProfile`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};


// Devuelve todos los nombres de las familias si eres admin
export const getAllFamiliyNamesService = async (token)=> {
  // console.log(url);
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/familyNames`,
  {
    method: "GET",
    headers:{
      Authorization: token,
    }
  });

  const json = await response.json();
  if(!response.ok) {
    throw new Error(json.message);
  }
  
  return json.data;    
}