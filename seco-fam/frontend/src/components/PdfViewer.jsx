import { object } from "prop-types";
const myPdf = require("../assets/data/Cabalar.pdf");
type="application/pdf"

export const PdfViewer = ()=> {
  return (
    <object
    type="application/pdf"
    width="100%"
    height="100%"
    >
      {myPdf}
    </object>
  )
}