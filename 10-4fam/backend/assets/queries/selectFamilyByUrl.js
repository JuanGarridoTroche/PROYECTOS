const data = require("../lineages.json");
const { generateError } = require('../../helpers');

const selectFamilyByUrl = async (url) => { 
  
  let user = [];
  try {
    // Comprobamos que la password coincide con alguna de las familias
    for(let family of data) {
      if(family.url === url) {
        user.push({id: family.id, lineage: family.lineage, active: family.active, pdf: family.pdf, url: family.url, role: family.role, logo: family.logo});        
      }
    }
    
    return user[0];
  } catch (err) {
    // console.error("Error");
    throw generateError("No existe la url indicada", 404)
  }
}

module.exports = selectFamilyByUrl;