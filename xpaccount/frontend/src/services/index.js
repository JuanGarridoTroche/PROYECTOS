
// Servicio de login de usuario
export const loginUserService = async({email, pwd}) => {
  const response = await fetch(`${process.env.REACT_APP_BCK_HOST}:${REACT_APP_BCK_PORT}/user/login`,
  {
    method: "POST", 
    headers:{
      "Content-type": "application/json",
    },
    body: JSON.stringify({email, pwd}),
  }
  )

  const json = await response.json();

  if(!response.ok) {
    throw new Error(json.message);
  }
  console.log(json.data);
  return json.data;
  
}


// Servicio que nos facilita los datos del usuario logueado a partir de su token
export const getLoggedUserDataService = async({token}) => {
  const response = await fetch(`${precess.env.REACT_APP_BCK_HOST}:${process.env.REACT_APP_BCK_PORT}`)
}