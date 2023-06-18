const data = require("../lineages.json");
const { generateError } = require('../../helpers');

const selectFamilyById = async (id) => { 
  
  let user = [];
  try {
    // Comprobamos que la password coincide con alguna de las familias
    for(let family of data) {
      if(family.id === id) {
        user.push({id: family.id, lineage: family.lineage, active: family.active, pdf: family.pdf, url: family.url, role: family.role});        
      }
    }
    // console.log(user[0]);
    return user[0];
  } catch (err) {
    throw generateError("No existe la familia indicada", 404)
  }
}

module.exports = selectFamilyById;