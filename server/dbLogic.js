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
    pool: { max: 10 }
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
    pool: { max: 25 }
  });

  var run = async (DI_data, callback) => {
    let session = await DI_data.pool.acquire()
    let data = await callback(session)
    if (data.length == 1) { data = data[0]; }
    await session.close()
    return data
  }
  DI.data = {
    client: client,
    pool: pool,
    runQuery: async (DIdata, query, params = null) => {
      return run(DIdata, async (session) => {
        return session.query(query, {params: params}).all();
      })
    },
    runCommand: async (DIdata, query, params = null) => {
      return run(DIdata, async (session) => {
        return session.command(query, {params: params}).all()
      })
    }
  }
}

module.exports = setupDatabase
