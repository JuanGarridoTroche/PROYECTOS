
export const loginUserService = async(lineage, password)=> {
  const response = await fetch(`
  ${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/`,
  {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({lineage, password}),
  })

  const json = await response.json();

  if(!response.ok) {
    throw new Error(json.message);
  }
  return json.data;
}