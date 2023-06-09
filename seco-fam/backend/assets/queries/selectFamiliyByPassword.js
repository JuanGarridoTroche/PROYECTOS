const bcrypt = require('bcrypt');
const data = require("../lineages.json");

const selectFamilyByPassword = async (password) => { 
  
  let user = [];
  try {
    // Comprobamos que la password coincide con alguna de las familias
    for(let family of data) {
      if(await bcrypt.compare(password, family.password)) {
        user.push({id: family.id, lineage: family.lineage, active: family.active});        
      }
    }
    // console.log(user[0]);
    return user[0];
  } catch (err) {
    console.error("Error");
  }
}

module.exports = selectFamilyByPassword;