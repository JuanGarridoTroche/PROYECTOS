const selectAccountByIdAccountQuery = require("../../bbdd/queries/accounts/selectAccountByIdAccountQuery");
const deleteEntryQuery = require("../../bbdd/queries/entries/deleteEntryQuery");
const selectEntryByIdQuery = require("../../bbdd/queries/entries/selectEntryByIdQuery");
const { generateError } = require("../../helpers");

const deleteEntry = async (req, res, next) => {
  const {idAccount, idEntry} = req.params;
  const idUser = req.user.id;

  try {

    // Seleccionamos los datos del asiento bancario    
    const myEntry = await selectEntryByIdQuery(idEntry);

    if(!myEntry) {throw generateError("El asiento bancario seleccionado no existe", 404)}

    if(myEntry.idAccount !== parseInt(idAccount)) {
      throw generateError("La cuenta no es correcta. Por favor, revisa los datos", 404)
    }

    // Comprobar que el asiento bancario corresponde al usuario logueado
    const validatingAccount = await selectAccountByIdAccountQuery(idAccount);
    if (!validatingAccount || validatingAccount.idUser !== idUser) {
      throw generateError("La cuenta no existe", 404);
    }

    // Eliminamos el asiento bancario
    await deleteEntryQuery(idEntry, idAccount);
    
    
    res.send({
      status: "ok",
      message: "Asiento eliminado 🔴",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteEntry;
