// Servicio que carga las noticias ordenadas desde la más actual a la más antigua
export const loadNewsService = async (queryString) => {
  // URL Base
  let url = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news`;

  if (queryString) {
    url += queryString;
  }

  //Extraemos (fetch) desde nuestro Backend la info con el endpoint que necesitemos
  const response = await fetch(url);

  const json = await response.json();

  // Si la respuesta no es Ok, generamos un error
  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data.news;
};

//  Servicio de registro de nuevo usuario
export const registerUserService = async ({
  username,
  email,
  password,
  bio,
}) => {
  //Extraemos (fetch) desde nuestro Backend la info con el endpoint que necesitemos
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, email, password, bio }),
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
};

// Servicio de login de usuario
export const loginUserService = async ({ email, password }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/login`,
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
export const getloggedUserDataService = async ({ token }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users`,
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

// Conseguir los datos de usuario a través del id
export const getUserDataService = async ({ idUser }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/profile/${idUser}`
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Servicio que envía los datos de una nueva noticia
export const createNewsService = async ({ data, token }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news`,
    {
      method: "POST",
      body: data,
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

// Servicio que carga las 10 noticias  mejor valoradas (feedback)
export const loadNewsByCategoryService = async (category) => {
  //Extraemos (fetch) desde nuestro Backend la info con el endpoint que necesitemos
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/categoria/${category}`
  );

  const json = await response.json();

  // Si la respuesta no es Ok, generamos un error
  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Servicio que carga las 10 noticias  mejor valoradas (feedback)
export const loadNewsByFeedbackService = async () => {
  //Extraemos (fetch) desde nuestro Backend la info con el endpoint que necesitemos
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/ByFeedback`
  );

  const json = await response.json();

  // Si la respuesta no es Ok, generamos un error
  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data.byFeedback;
};

export const newsService = async ({ id, token, method }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/${id}`,
    {
      method: method,
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

export const searchingNewsService = async ({ search }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/search/${search}`
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getUserNewsService = async ({ id, token }) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/users`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const json = response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const voteNewsService = async ({ id, token, method, body }) => {
  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/${id}/votes`,
    {
      method: method,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const json = response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Edita los campos de username, email y bio de un usuario logueado
export const editUserProfile = async ({ token, formData }) => {
  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/profile`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      body: formData,
    }
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const editUserAvatar = async ({ token, avatar }) => {
  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/photo`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      photo: avatar,
    }
  );
  const json = response.json();

  if (!response.ok) {
    throw await new Error(json.ok);
  }

  return json.data;
};

export const editNewsService = async (formData, idNews, token) => {
  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/news/${idNews}`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      body: formData,
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Solicitud de recuperación de contraseña con el envío de un código a tu cuenta de correo electrónico
export const passCodeSolicitudeService = async ({ email }) => {
  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/password/solicitude`,
    {
      method: "PUT",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

// Introduce el código que te llega al correo + cambio de contraseña
export const recoverPasswordService = async ({ recoverPassCode, newPassword, newPasswordRepeated }) => {

  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/password/recover`,
    {
      method: "PUT",
      body: JSON.stringify({ recoverPassCode, newPassword, newPasswordRepeated }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
  return json.data;
};

export const checkVotedNewsService =async ({token}) => { 
  const response = await fetch(
    `
    ${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/votes`,
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
} 