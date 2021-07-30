var db = require('../foundation/dbLogic')
var userQueries = require("../queries/user/userModel")
var DI = require('../foundation/DICore')

module.exports = {
  getAll: async () => {
    return "foo"
  },
  createNew: async (username, password, sessionId) => {
    return await db.runQuery(userModel.create, [ username, password, sessionId ])
  },
  findByName: async (username) => {
    return await db.runQuery(userModel.findByName, [ username ])
  },
  findById: async (id) => {
    return await db.runQuery(userModel.findById, [ id ])
  },
  findByLogin: async (username, password) => {
    return await db.runQuery(userModel.findByLogin, [ username, password ])
  },
  setSession: async (sessionId, id) => {
    return await db.runQuery(userModel.setSession, [ sessionId, DI.datetimes.utcNow(), id ])
  },
  logout: async (sessionId) => {
    return await db.runQuery(userModel.logout, [ sessionId ])
  }
}
