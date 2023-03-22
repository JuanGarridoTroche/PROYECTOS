// Servicio de login de usuario
export const loginUserService = async ({ email, password }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/login`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  } 
  return json.data;
};

// Servicio que nos facilita los datos del usuario logueado a partir de su token
export const getLoggedUserDataService = async ({ token }) => {

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/loggedProfile`,
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


export const getAccountsUserService = async({token}) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/accounts`,
    {
      headers: {
        Authorization: token,
      }
    }
  )

  const json = await response.json();
  
  if(!response.ok) {
    throw new Error(json.message);
  }
  
  return json.data;
}