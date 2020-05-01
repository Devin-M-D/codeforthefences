var OrientDB = require("orientjs")
var OrientDBClient = OrientDB.OrientDBClient

const config = {
  host: "localhost",
  db: "cookbook",
  rootUser: "root",
  rootPassword: "testpass123"
};

const setupDatabase = async (DI) => {
  let client = await OrientDBClient.connect({
    host: config.host,
    pool: {
      max: 10
    }
  });

  let exists = await client.existsDatabase({
    name: config.db,
    username: config.rootUser,
    password: config.rootPassword
  });

  let pool = await client.sessions({
    name: config.db,
    username: config.user,
    password: config.password,
    pool: {
      max: 25
    }
  });

  var runQuery = async (DI_data, query) => {
    let session = await DI_data.pool.acquire();
    let data = await session.query(query).all();
    await session.close();
    return data;
  }

  DI.data.client = client
  DI.data.pool = pool
  DI.data.runQuery = runQuery
}

module.exports = setupDatabase
