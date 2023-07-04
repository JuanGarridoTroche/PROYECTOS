import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllFamiliyNamesService} from "../services";


export const Aside = ()=> {
  const [error, setError] = useState("");
  const {logged, token} =useContext(AuthContext);
  const [familyNames, setFamilyNames] = useState([]);

  useEffect(()=> {
    const getFamilyNames = async() => {
      try {
        const families = await getAllFamiliyNamesService(token, logged?.url);
        // console.log(families);
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
        {/* <li className="aside--add-pdf aside__item"><a href="/familia/administrator">Añadir pdf</a></li> */}
        <li><h3 className="aside__title">Familias</h3></li>
        {familyNames.map((family) => {
          return <li className="aside__family-name aside__item" key={family.id}><a href={`/familia/administrator/${family.url}`}>{family.lineage}</a></li>
        })}
        <li className="aside__family-name aside__item" key="añadido"><a href={`/familia/administrator/addPDF`}>Añadir</a></li>
      </ul>
    </aside>
  )
}