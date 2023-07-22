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
export const getAllFamiliyNamesService = async (token) => {
  // console.log(url);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/familyNames`,
    {
      method: 'GET',
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

// Login de usuario
export const loginUserService = async (password) => {
  const response = await fetch(
    `
  ${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ password }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
  // console.log(json.data);
  return json;
};

// Enviar correo al administrador desde el formulario de la web
export const sendMailService = async ({ token, name, emailContact, text, subject }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/form/sendForm`,
    {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name, emailContact, text, subject }),
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  // console.log(json.data);
};

// Servicio que devuelve el nombre de la familia a partir de la url y estando logueado y los pdfs
export const getFamilyNameAndPdfsService = async (token, url) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/${url}`,
    {
      method: 'GET',
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

// Crear un pdf dentro de una de las familias
export const createPDFService = async (token, url, uploadPDF) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/createPDF/${url}`,
    {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: uploadPDF,
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }

  return JSON.parse(json.data);
};

// Sustituir un pdf por otro con el mismo nombre
export const updatePDFService = async (token, url, uploadPDF) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/pdf/${url}`,
    {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: uploadPDF,
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  console.log(json.data);
  return json.data;
};

// Obtener los datos de una famillia a través de su url
export const getFamilyDataByUrlService = async (token, url) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/data/${url}`,
    {
      method: 'GET',
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

// Eliminar un pdf desde la cuenta de administrador
export const deletePdfService = async (token, name, lineage) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/pdf`,
    {
      method: 'DELETE',
      headers: {
        Authorization: token,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name, lineage }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  console.log(json.data);

  return json.data;
};
