const bcrypt = require('bcrypt');
const data = require("../lineages.json");



const selectFamilyByPassword = async (password) => { 
  
  let user = [];
  try {
    for(let family of data) {
      if(await bcrypt.compare(password, family.password)) {
        user.push(family.lineage);

      }
    }
    return user[0];
  } catch (err) {
    console.error("Error");
  }

  console.log("Familias: ", lineage);

}

module.exports = selectFamilyByPassword;