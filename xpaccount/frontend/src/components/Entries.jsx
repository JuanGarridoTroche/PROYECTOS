import { useEffect, useState } from "react"
import { UpdateEntry } from "./UpdateEntry"

export const Entries = ({entry, setRecoverEntries, recoverEntries})=> {
  const [idEntry, setIdEntry] = useState(0);
  const [dateEntry, setDateEntry] = useState(entry.dateEntry)
  const [category, setCategory] = useState(entry.category);
  const [subcategory, setSubcategory] = useState(entry.subcategory);
  const [amount, setAmount] = useState(entry.amount);
  const [concept, setConcept] = useState(entry.concept);
  const [comment, setComment] = useState(entry.comment);
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
        <button onClick={() => {
          setIdEntry(entry.id)
          setRecoverEntries(!recoverEntries)
          }}
        >
          Editar
        </button>
        </td>
      </tr> 
      :        
      <tr>  
        <td className="updt-date"><input type="text" name="dateEntry" id="dateEntry" value={dateEntry} onChange={(e)=> {setDateEntry(e.target.value)}} key={entry.id}/></td>
        <td className="updt-cat"><input type="text" name="category" id="category" value={category} onChange={(e)=>{setCategory(e.target.value)}} /></td>
        <td className="updt-subcat"><input type="text" name="subcategory" id="subcategory" value={subcategory} onChange={(e)=>{setSubcategory(e.target.value)}} /></td>
        <td className="updt-amount"><input type="number" name="amount" id="amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/></td>        
        <td className={parseFloat(entry.total) > 0 ? "numbers" : "numbers negative"}>
            {parseFloat(entry.total).toFixed(2)} EUR
        </td> 

        <td className="concept"><input type="text" name="concept" id="concept" value={concept} onChange={(e)=>{setConcept(e.target.value)}} /></td>
        <td className="comment"><input type="text" name="comment" id="comment" value={comment} onChange={(e)=>{setComment(e.target.value)}} /></td>
        <td>
        <button className="updating" onClick={() => {
          setIdEntry(0);
          setRecoverEntries(!recoverEntries)
          }}
        >
          Actualizar
        </button>
        </td>
      </tr>      
      }
    </>
  )
}