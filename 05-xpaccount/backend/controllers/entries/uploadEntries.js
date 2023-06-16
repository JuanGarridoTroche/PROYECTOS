const { generateError, excelSantanderToJSON } = require("../../helpers");

const UploadEntries = async (req, res, next) => {
  try {
    const excelFile = 'export2023316.xlsx'
    const body = excelSantanderToJSON(excelFile);
    
    res.send({
      status: "ok",
      message: "Asiento realizado con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = UploadEntries;
