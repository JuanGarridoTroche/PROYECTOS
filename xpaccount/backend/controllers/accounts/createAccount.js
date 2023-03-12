const insertAccountQuery = require("../../bbdd/queries/accounts/insertAccountQuery");
const { generateError } = require("../../helpers");

const createAccount = async (req, res, next) => {
  try {
    const {alias, bankname, ibanCode, entityCode, officeCode, digitControl, number} = req.body;
    const {idUser} = req.user;
    if (
      ibanCode.length !== 4 ||
      entityCode.length !== 4 ||
      officeCode.length !== 4 ||
      digitControl.length !== 2 ||
      number.length !== 10
    ) {
      throw generateError("El número de cuenta no es correcto", 401);
    }
    const accountNumber = [ibanCode, entityCode, officeCode, digitControl, number].join("");
    console.log(accountNumber);
    const body = await insertAccountQuery(idUser, alias, bankname, ibanCode, entityCode, officeCode, digitControl, number)
  } catch (err) {
    next(err);
  }
};

module.exports = createAccount;
