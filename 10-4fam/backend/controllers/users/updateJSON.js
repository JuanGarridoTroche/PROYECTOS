const {generateError} = require("../../helpers")
// const data = require("../../assets/lineages.final.json");
const fs = require("fs/promises");

const updateJSON = async (req, res, next) => {
  const readingJson = await fs.readFile("/assets/lineages.final.json", "utf-8")
  const data = JSON.parse(readingJson);
  const myData = structuredClone(data);  
  const {lineage} = req.body;
  
  try {   
    if(!req.files) {
      throw generateError("No hay un fichero pdf",400)
    }
    
    
    const {pdf} = req.files;  
    if(!pdf.name || !pdf.data || pdf.mimetype !== 'application/pdf') {
      throw generateError("Introduzca un fichero pdf válido", 400)
    }

    myData.map((item, index)=> {
      if(item.lineage === lineage) {
        // myData[index].pdf = [...item.pdf, pdf.name] 
        myData[index].pdf.push(pdf.name);
      }
    })

   const myNewData = JSON.stringify(myData);
   fs.writeFile("/assets/lineages2.json", myNewData, "utf-8", (err) => {
    if (err) {throw generateError("Error a la hora de guardar el fichero JSON", 400)}
   });
    
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