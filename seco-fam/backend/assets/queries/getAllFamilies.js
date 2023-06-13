const data = require("../lineages.json");

const getAllFamilies = () => { 
  let lineage = [];
  try {
    for(let family of data) {
      lineage.push({id: family.id, lineage: family.lineage});      
    }
    lineage.pop();
    return lineage;
    
  } catch (err) {
    console.error("Error");
  }  

}

module.exports = getAllFamilies;