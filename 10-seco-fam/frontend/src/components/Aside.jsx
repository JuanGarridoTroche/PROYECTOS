import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllFamiliyNamesService, getFamiliyNamesService } from "../services";

export const Aside = ()=> {

  const [error, setError] = useState("");
  const {logged, token, logout} =useContext(AuthContext);
  const [familyNames, setFamilyNames] = useState([]);
  const navigate = useNavigate();

  useEffect(()=> {
    const getFamilyNames = async() => {
      try {
        const families = await getAllFamiliyNamesService(token, logged?.url);
        console.log(families);
        setFamilyNames(families);
      } catch (err) {
        setError(err.message);
      }
    }
    if(token) getFamilyNames();
  },[token, logged?.url])

  return (
    <aside className="aside">
      <ul className="aside__list">
        <li className="aside--add-pdf aside__item"><a href="">Añadir pdf</a></li>
        <li><h3 className="aside__title">Familias</h3></li>
        {familyNames.map((family) => {
          return <li className="aside__family-name aside__item" key={family.id}><a href="#">{family.lineage}</a></li>
        })}
      </ul>
    </aside>
  )
}