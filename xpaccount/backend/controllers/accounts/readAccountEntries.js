const selectEntriesByIdAccountQuery = require("../../bbdd/queries/accounts/selectEntriesByIdAccountQuery")

const readAccountEntries = async (req, res, next) => {
  try {
    const {idAccount} = req.params;
    console.log("idAccount: ", idAccount);

    // Seleccionamos todos los asientos bancarios de la cuenta con idAccount
    const entries = await selectEntriesByIdAccountQuery(idAccount);

    res.send({
      status: "ok",
      message: `Asientos bancarios de la cuenta con id ${idAccount}`,
      data: entries,
    })
    
  } catch (err) {
    next(err)
  }
}

module.exports = readAccountEntries;