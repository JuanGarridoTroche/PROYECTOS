
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

  if(!response.ok) {
    throw new Error(json.message);
  }
  console.log(json.data);
  return json.data;
};
