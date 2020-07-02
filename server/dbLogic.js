var OrientDB = require("orientjs")
var OrientDBClient = OrientDB.OrientDBClient

const config = {
  host: "localhost",
  db: "cookbook",
  rootUser: "root",
  rootPassword: "testpass123"
}

module.exports = async (DI) => {
  let client = await OrientDBClient.connect({
    host: config.host,
    pool: { max: 100 }
  })
  var dbExists = client.existsDatabase({
    name: config.db,
    username: config.rootUser,
    password: config.rootPassword
  })
  if (!dbExists){
    console.log(`Db ${config.db} doesn't exist! Exiting `)
    return false
  }

  //#region file funcs
  async function flattenSingletons(data){
    if (DI.utils.isDef(data)){
      if (data.length == 1) { data = data[0] }
    }
  }
  function setParams(params){
    if (params != null)  { return { params: params } }
    else { return params }
  }
  async function makeRootSession() {
    return await client.session({ name: "cookbook", username: "root", password: "testpass123" })
  }
  async function runQuery(session, query, params) {
    params = setParams(params)
    var queryObj = null
    if (params == null) { queryObj = await session.query(query) }
    else { queryObj = await session.query(query, params) }
    wrapUp(session)
    return await queryObj.all().then((data)=> { return JSON.parse(JSON.stringify(data)) })
  }
  async function runCommand(session, query, params) {
    params = setParams(params)
    var queryObj = null
    if (params == null) { queryObj = await session.command(query) }
    else { queryObj = await session.command(query, params) }
    wrapUp(session)
    return await queryObj.all().then((data)=> { return JSON.parse(JSON.stringify(data)) })
  }
  async function runBatch(session, query, params) {
    params = setParams(params)
    var queryObj = null
    if (params == null) { queryObj = await session.batch(query) }
    else { queryObj = await session.batch(query, params) }
    wrapUp(session)
    return await queryObj.all().then((data)=> { return JSON.parse(JSON.stringify(data)) })
  }
  async function wrapUp(session) {
    await session.close()
  }
  //#endregion

  //#region main def
  DI.data = {
    parseRid: function (ridProp) {
      return `#${ridProp.cluster}:${ridProp.position}`
    },
    client: client,
    startPool: async (username, password) => {
      return await client.sessions({
        name: config.db,
        username: username,
        password: password,
        pool: { max: 25 }
      })
    },
    runQuery: async (sessionPool, query, params = null) => {
      var session = await sessionPool.acquire()
      return await runQuery(session, query, params)
    },
    runCommand: async (sessionPool, query, params = null) => {
      var session = await sessionPool.acquire()
      return await runCommand(session, query, params)
    },
    runBatch: async (sessionPool, query, params = null) => {
      var session = await sessionPool.acquire()
      return await runBatch(session, query, params)
    },
    rootQuery: async (query, params = null) => {
      var session = await makeRootSession()
      return await runQuery(session, query, params)
    },
    rootCommand: async (query, params = null) => {
      var session = await makeRootSession()
      return await runCommand(session, query, params)
    }
  }
  //#endregion

  return DI
}
