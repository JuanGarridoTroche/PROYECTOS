import { useEffect, useState } from "react"
import { UpdateEntry } from "./UpdateEntry"

export const Entries = ({entry, setRecoverEntries, recoverEntries})=> {
  const [idEntry, setIdEntry] = useState(0);
  const [error, setError] = useState("");
  const [dateEntry, setDateEntry] = useState(entry.dateEntry)
  const [category, setCategory] = useState(entry.category);
  const [subcategory, setSubcategory] = useState(entry.subcategory);
  // console.log(recoverEntries);
  

  return (
    <>
      {entry.id !== idEntry ?
      <tr>        
        <td>{entry.dateEntry}</td>
        <td>{entry.category}</td>
        <td>{entry.subcategory}</td>
        <td className={parseFloat(entry.amount) > 0 ? "numbers" : "numbers negative"}>
          {parseFloat(entry.amount).toFixed(2)} EUR
        </td>
        <td className={parseFloat(entry.total) > 0 ? "numbers" : "numbers negative"}>
            {parseFloat(entry.total).toFixed(2)} EUR
        </td>
        
        <td className="concept">{entry.concept}</td>
        <td className="comment">{entry.comment}</td>
        <td>
          <UpdateEntry entry={entry} idEntry={idEntry} setIdEntry={setIdEntry}/>
        </td>
      </tr> 
      :
        
      <tr>  
        <td><input type="text" name="dateEntry" id="dateEntry" value={dateEntry} onChange={(e)=> {setDateEntry(e.target.value)}} key={entry.id}/></td>
        <td><input type="text" name="category" id="category" value={category} onChange={(e)=>{setCategory(e.target.value)}} /></td>
        <td><input type="text" name="subcategory" id="subcategory" value={subcategory} onChange={(e)=>{setSubcategory(e.target.value)}} /></td>
        
        <td className={parseFloat(entry.amount) > 0 ? "numbers" : "numbers negative"}>
          {parseFloat(entry.amount).toFixed(2)} EUR
        </td>
        <td className={parseFloat(entry.total) > 0 ? "numbers" : "numbers negative"}>
            {parseFloat(entry.total).toFixed(2)} EUR
        </td>
        
        <td className="concept">{entry.concept}</td>
        <td className="comment">{entry.comment}</td>
        <td>
          <UpdateEntry entry={entry} idEntry={idEntry} setIdEntry={setIdEntry}/>
        </td>
      </tr>      
      }
    </>
  )
}