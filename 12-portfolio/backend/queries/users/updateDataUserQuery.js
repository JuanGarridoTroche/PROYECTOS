const getConnection = require('../../ddbb/getConnection');

const updateDataUserQuery = async (dataUserUpdated, id) => {
  const {firstName, lastName1, lastName2, address, postcode, locality, province, country} = dataUserUpdated;
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `
        UPDATE users SET  firstName = ?, lastName1 = ?, lastName2 = ?, address = ?, postcode = ?, locality = ?, province = ?, country = ?, modifiedAt = ? WHERE id = ?`,
      [firstName, lastName1, lastName2, address, postcode, locality, province, country, new Date(), id]
    );
    
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateDataUserQuery;
