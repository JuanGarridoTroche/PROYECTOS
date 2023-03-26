const selectEntriesByIdAccountQuery = require("../../bbdd/queries/accounts/selectEntriesByIdAccountQuery")

const readAccountEntries = async (req, res, next) => {
  try {
    const {idAccount} = req.params;
    const entries = await selectEntriesByIdAccountQuery(idAccount);


    res.send({
      status: "Ok",
      message: `Asientos bancarios de la cuenta ${idAccount}`,
      data: entries,
    })
    
  } catch (err) {
    next(err)
  }
}

module.exports = readAccountEntries;