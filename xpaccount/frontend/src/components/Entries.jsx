import { UpdateEntry } from "./UpdateEntry"

export const Entries = ({entry})=> {

  return (
    <tbody key={entry.id} className="tbody-entries">
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
          <UpdateEntry entry={entry}/>
        </td>
      </tr>
    </tbody>
  )
}