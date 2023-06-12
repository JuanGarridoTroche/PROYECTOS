
const deleteAccountByIdQuery = require("../../bbdd/queries/accounts/deleteAccountByIdQuery");
const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");
const { generateError } = require("../../helpers");

const deleteAccount = async (req, res, next) => {
  try {
    const {idAccount} = req.params;

     // Comprobar que la cuenta que se quiere modificar pertenece al usuario logueado
     const checkingAccount = await selectAccountByIdAccountQuery(idAccount);

     // Si enviamos un id incorrecto O el id del usuario que creó la cuenta es distinto al que está logueado
     if (!checkingAccount || checkingAccount.idUser !== req.user.id) {
       throw generateError("Esta cuenta no existe", 404);
     }

     // Eliminamos la cuenta
    //  await deleteAccountByIdQuery(idAccount, req.user.id);
    await deleteAccountByIdQuery(idAccount, req.user.id)

    
    res.send({
      status: "ok",
      message: "Cuenta eliminada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteAccount;