const data = require("../lineages.json");

const getAllFamilies = () => { 
  let lineage = [];
  try {
    for(let family of data) {
      lineage.push({id: family.id, lineage: family.lineage, url: family.url, logo: family.logo});      
    }
    lineage.pop();
    return lineage;
    
  } catch (err) {
    console.error("Error");
  }  

}

module.exports = getAllFamilies;