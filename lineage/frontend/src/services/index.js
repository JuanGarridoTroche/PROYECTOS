// Carga de la lista de usuarios registrados
export const loadUsersService = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/list`
  );

  // Desestructuramos el json que nos devuelve
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Servicio de login de usuario. Devuelve un objeto con {token: ''}
export const loginUserService = async (email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/login`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(email, password),
    }
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
  // console.log(json.data);
  return json.data;
};

// Registro de un nuevo usuario
export const registerUserService = async (newUser) => {

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/register`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    }
  );
  const json = await response.json();
  if(!response.ok) {
    throw new Error(json.message);
  }
  return json.data;
};


// Validar cuenta de usuario con el registrationCode que te ha llegado a tu correo
export const validateRegistrationCodeService = async(registrationCode)=> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/users/register/validate/${registrationCode}`, 
  {
    method: "PUT",
  })
  const json = await response.json();
  if(!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
}