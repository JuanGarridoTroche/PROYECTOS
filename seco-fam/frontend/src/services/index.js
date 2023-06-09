
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



// Muestra los datos del usuario logueado a partir de su token
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

export const getFamiliyNamesService = async(token)=> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/familyNames`,
  {
    method: "GET",
    headers:{
      Authorization: token,
    }
  });

  const json = response.json();
  if(!response.ok) {
    throw new Error(json.message);
  }

  return json.data;    
}