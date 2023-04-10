const { generateError } = require("../../helpers");
const XLSX = require("xlsx");

const uploadEntriesExcelToJson = async (req, res, next) => {

  // Usar path y fs para modificar la ruta
  const excel = XLSX.readFile("D:\\Programación\\PROYECTOS\\xpaccount\\backend\\uploads\\export2023316.xls");

  // Vamos a leer el nombre de las hojas que hay en nuestro excel
  const sheetName = excel.SheetNames;
  let data = XLSX.utils.sheet_to_json(excel.Sheets[sheetName[0]], {
    cellDates: true,
  })
  console.log(data);
  try {
    
    res.send({
      status: "ok",
      message: "Fichero excel subido con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = uploadEntriesExcelToJson;
