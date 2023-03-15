const insertAccountQuery = require("../../bbdd/queries/accounts/insertAccountQuery");
const selectAccountsByIdUserQuery = require("../../bbdd/queries/accounts/selectAccountsByIdUserQuery");
const { generateError } = require("../../helpers");

const createAccount = async (req, res, next) => {
  try {
    const {alias, bankName, ibanCode, entityCode, officeCode, digitControl, number} = req.body;
    const {id: idUser} = req.user;

    if (
      ibanCode.length !== 4 ||
      entityCode.length !== 4 ||
      officeCode.length !== 4 ||
      digitControl.length !== 2 ||
      number.length !== 10
    ) {
      throw generateError("El número de cuenta no es correcto", 401);
    }
    const numberAccount = [ibanCode, entityCode, officeCode, digitControl, number].join("");
    console.log("Número de cuenta nuevo: ", numberAccount);
    // Comprobamos que la cuenta no está creada
    const checkAccount = await selectAccountsByIdUserQuery(idUser);
    console.log("resultado del SELECT: ", checkAccount);
    if(checkAccount) {
      checkAccount.map(checking => { 
        console.log(checking.numberAccount);       
        if(checking.numberAccount === numberAccount){
          throw generateError('Esta cuenta ya está creada. Introduce otra cuenta',403);
        }        
      })
    }

    const body = await insertAccountQuery({idUser, alias, bankName, numberAccount})

    res.send({
      status: "Ok",
      message: "Cuenta creada con éxito",
      body,
    })
  } catch (err) {
    next(err);
  }
};

module.exports = createAccount;
