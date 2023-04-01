// Servicio de login de usuario. Devuelve un objeto con {token: ''}
export const loginUserService = async ({ email, password }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/user/login`,
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
export const getLoggedUserDataService = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/user/loggedProfile`,
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

// Obtenemos todas las cuentas bancarias creadas por el usuario logueado
export const getAccountsUserService = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/user/accounts`,
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

// Crear una cuenta
export const createAccountService = async ({ token, data }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/account`,
    {
      method: "POST",
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

  return json.data;
};

// Crear un nuevo usuario
export const registerUserService = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/user/register`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  console.log(json.data);
  return json.data;
};

// Validar el usuario creado con el código de registro llegado al correo y activándolo
export const validateUserService = async (registrationCode) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/user/register/validate/${registrationCode}`,
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

// Actualizar el perfil de usuario
export const updateUserProfileService = async ({ token, data }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/user/updateProfile`,
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

  return json.data;
};

// Leer los asientos bancarios de una cuenta
export const readEntriesByAccountService = async ({ idAccount, token }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/account/${idAccount}/entries`,
    {
      method: "GET",
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

// Leer los datos de una cuenta
export const readingAccountService = async ({ idAccount, token }) => {
  const response = await fetch(
    `
  ${import.meta.env.VITE_BACKEND_BASE_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/account/${idAccount}`,
    {
      method: "GET",
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


// Traemos todas las categorías de la cuenta indicada
export const loadCategories = async (token, idAccount) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}/account/${idAccount}/categories`,
    {
      method: "GET",
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


// Cargamos todas las subcategorías de la categoría indicada
export const loadSubcategories = async (token, idCategory) => {
  
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}/category/${idCategory}/subs`,
    {
      method: "GET",
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


// Añadir asiento bancario
export const AddEntryService = async(token, idAccount, data)=>{
  console.log(data);
  const response = await fetch(`
  ${import.meta.env.VITE_BACKEND_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}/account/${idAccount}/entry`,
  {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const json = await response.json();

  if(!response.ok) {
    throw new Error(json.message)
  }

  console.log(json.data);
  return json.data;
}