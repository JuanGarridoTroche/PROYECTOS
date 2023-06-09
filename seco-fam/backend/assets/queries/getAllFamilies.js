const data = require("../lineages.json");

const getAllFamilies = () => { 
  let lineage = [];
  try {
    for(let family of data) {
      lineage.push(family.lineage);
    }

    return lineage;
    
  } catch (err) {
    console.error("Error");
  }  

}

module.exports = getAllFamilies;