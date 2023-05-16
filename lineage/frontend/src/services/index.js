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

// Servicio de login de usuario. Devuelve un objeto con {tokenLng: ''}
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
      body: JSON.stringify({ email, password }),
    }
  );
  const json = await response.json();

  if (!response.ok) {
    console.log(json.message);
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
  if (!response.ok) {
    throw new Error(json.message);
  }
};

// Validar cuenta de usuario con el registrationCode que te ha llegado a tu correo
export const validateRegistrationCodeService = async (registrationCode) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/register/validate/${registrationCode}`,
    {
      method: "PUT",
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Muestra los datos del usuario logueado/autorizado a partir de su token
export const getLoggedUserDataService = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/loggedProfile`,
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

// Actualizar los datos de perfil del usuario logueado
export const updateLoggedUserDataService = async (token, data) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/updateUserProfile`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
};

// Actualizar la contraseña desde UserProfilePage
export const updatePasswordService = async ({
  token,
  password,
  newPassword,
  newPasswordRepeated,
}) => {
  const response = await fetch(
    ` ${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/users/editPassword`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password, newPassword, newPasswordRepeated }),
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }  
};
