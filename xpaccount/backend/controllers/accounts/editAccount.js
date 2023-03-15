const { generateError } = require("../../helpers");
const updateAccountQuery = require("../../bbdd/queries/accounts/updateAccountQuery");
const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");

const editAccount = async (req, res, next) => {
  try {
    const { idAccount } = req.params;
    let { alias, bankName } = req.body;

    // Comprobar que la cuenta que se quiere modificar pertenece al usuario logueado
    const checkingAccount = await selectAccountByIdAccountQuery(idAccount);

    // Si enviamos un id incorrecto O el id del usuario que creó la cuenta es distinto al que está logueado
    if (!checkingAccount || checkingAccount.idUser !== req.user.id) {
      throw generateError("Esta cuenta no existe", 404);
    }

    // Si hay algún dato que no se desee modificar (vienen en blanco), cogemos los datos que ya existen
    if (!alias) {
      alias = checkingAccount.alias;
    }
    if (!bankName) {
      bankName = checkingAccount.bankName;
    }

    // Editamos los valores alias y/o bankName de la cuenta
    const updatingAccount = await updateAccountQuery({
      idAccount,
      alias,
      bankName,
    });

    res.send({
      status: "ok",
      message: "Cuenta modificada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editAccount;
