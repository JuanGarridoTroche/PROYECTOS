const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");
const { generateError } = require("../../helpers");

const readAccount = async (req, res, next) => {
  const { idAccount } = req.params; 

  try {
    const myAccount = await selectAccountByIdAccountQuery(idAccount);

    if (!myAccount) {
      throw generateError("La cuenta no existe", 404);
    }

    res.send({
      status: "ok",
      message: `Datos de la cuenta con id ${idAccount}`,
      data: myAccount,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = readAccount;
