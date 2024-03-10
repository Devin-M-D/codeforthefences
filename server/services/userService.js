var bcrypt = require('bcryptjs')
var DI = require("../foundation/DICore")
var db = require('../foundation/dbLogic')
var userQueries = require("../queries/user/userQueries")

module.exports = {
  getAll: async () => {
    return await db.runQuery(userQueries.getAll)
  },
  findByName: async (username) => {
    return await db.runQuery(userQueries.findByName, [`${username}`], 1)
  },
  findById: async (id) => {
    return await db.runQuery(userQueries.findById, [ id ])
  },
  createUser: async (username, password, sessionId) => {
    var hash = await bcrypt.hash(password, await bcrypt.genSalt(10), null)
    var queryRes = await db.runQuery(userQueries.create, [ username, hash, sessionId ], 1)
    return queryRes
  }
}
