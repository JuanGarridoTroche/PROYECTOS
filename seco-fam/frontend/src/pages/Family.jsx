import { Header } from "../components/Header";

export const Family = ({lineage})=> {

  return(
    <>
      <Header lineage={lineage}/>
      <h2>Familia {lineage}</h2>
    </>
  )
}