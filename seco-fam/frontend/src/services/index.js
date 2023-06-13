
export const loginUserService = async(password)=> {
  const response = await fetch(`
  ${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/`,
  {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({password}),
  })

  const json = await response.json();

  if(!response.ok) {
    throw new Error(json.message);
  }
  // console.log(json.data);
  return json;
}



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


// Servicio que devuelve el nombre de la familia a partir de la url y estando logueado
export const getFamiliyNamesService = async (token, url)=> {
  // console.log(url);
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/${url}`,
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
  // console.log(json);
  return json.data;    
}

// Enviar correo al administrador desde el formulario de la web
export const sendMailService = async({token, name, text, subject})=> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/form/sendForm`,
  {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-type": "application/json",
    },
    body: JSON.stringify({name, text, subject}),
  });

  const json = await response.json();
  if(!response.ok) {
    throw new Error(json.message);
  }

  console.log(json.data);
}



// Devuelve todos los nombres de las familias
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
  // console.log(json);
  return json.data;    
}