var bcrypt = require('bcryptjs')
var DI = require('../foundation/DICore')
var db = require('../foundation/dbLogic')
var userQueries = require("../queries/user/userQueries")
var userService = require("./userService")

module.exports = {
  signup: async (username, password, sessionId) => {
    var hash = await bcrypt.hash(password, await bcrypt.genSalt(10), null)
    var queryRes = await db.runQuery(userQueries.create, [ username, hash, sessionId ], 1)
    return queryRes
  },
  logout: async (sessionId) => {
    return await db.runQuery(userQueries.logout, [ sessionId ])
  },
  findLogin: async (username, password) => {
    var user = await userService.findByName(username)
    if (user) {
      var passwordMatch = bcrypt.compare(password, user.password, (err, result) => {
        if (!result) { user = null }
      })
    }
    return user
  },
  setSession: async (sessionId, userId) => {
    return await db.runQuery(userQueries.setSession, [ sessionId, DI.datetimes.utcNow(), userId ])
  },
  getSession: async (sessionId) => {
    return await db.runQuery(userQueries.getSession, [ sessionId ], 1)
  },

}
