const bcrypt = require('bcrypt');
const data = require("../lineages.json");

const selectFamilyByLineage = async (lineage) => { 
  
  let user = [];
  try {
    // Comprobamos que la password coincide con alguna de las familias
    for(let family of data) {
      if(family.lineage === lineage) {
        user.push({id: family.id, lineage: family.lineage, active: family.active, pdf: family.pdf, url: family.url, role: family.role});        
      }
    }
    // console.log(user[0]);
    return user[0];
  } catch (err) {
    console.error("Error");
  }
}

module.exports = selectFamilyByLineage;