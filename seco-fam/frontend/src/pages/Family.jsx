import { Header } from "../components/Header";
import PropTypes from 'prop-types';
import ("../css/Family.css")

export const Family = ({lineage})=> {

  return(
    <>
      <Header lineage={lineage}/>
      <h2>Familia {lineage}</h2>
    </>
  )
}

Family.propTypes = {
  lineage: PropTypes.string,
}