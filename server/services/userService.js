var userModel = require("../models/mysql/userModel")
var DI = require('../foundation/DICore')
var db = require('../foundation/dbLogic')

module.exports = {
  getAll: async () => {
    // var user1 = user.create();
    // var foo = await user.save(user1)
    // var located = await user.find('user1')
    // console.log(`users: ${located.length}`, located)
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
