const selectAccountsByIdUserQuery = require("../../bbdd/queries/accounts/selectAccountsByIdUserQuery");
const { generateError } = require("../../helpers");


const getUserAccounts = async (req, res, next) => {
  try {
    const idUser = req.user?.id;
    console.log(idUser);
    
    if(!idUser) {
      throw generateError("Falta la cabecera de autenticación", 403)
    }

    // Guardamos todas las cuentas creadas por el usuario idUser
    const accounts = await selectAccountsByIdUserQuery(idUser);

    console.log("Mis cuentas", accounts);

        
    res.send({
      status: "ok",
      message: "Cuentas creadas por el usuario",
      data: accounts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getUserAccounts;
