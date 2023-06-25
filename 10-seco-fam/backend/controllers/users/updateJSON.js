const {generateError} = require("../../helpers")
const data = require("../../assets/lineages.final.json");
const myData = structuredClone(data);  

const updateJSON = async (req, res, next) => {
  const {lineage} = req.body;
  console.log("Familia: ", lineage);
  
  try {   
    if(!req.files) {
      throw generateError("No hay un fichero pdf",400)
    }
    
    
    const {pdf} = req.files;  
    if(!pdf.name || !pdf.data || pdf.mimetype !== 'application/pdf') {
      throw generateError("Introduzca un fichero pdf válido", 400)
    }

    myData.map((item, index)=> {
      console.log("Familia recorriendo el array: ", item.lineage);
      if(item.lineage === lineage) {
        // myData[index].pdf = [...item.pdf, pdf.name] 
        myData[index].pdf.push(pdf.name);
      }
    })

   console.log(myData);
    
    res.send({
      status: "Ok",
      message: `datos subidos al json`, 
      myData,  
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = updateJSON;