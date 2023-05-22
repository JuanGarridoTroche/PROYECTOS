import { Navigate } from "react-router-dom"

export const Login = ()=> {


  const handleLogin = ()=> {
    Navigate("/Login");
  }

  return (
    <button className="menu-header-navbarLogin" onClick={handleLogin}>Logout</button>
  )
}