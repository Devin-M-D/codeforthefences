var bcrypt = require('bcryptjs');
var queryBuilder = require('query-builder')(require('../foundation/dbLogic'))
var userQueries = require("../queries/user/userQueries")
var userService = require("./userService")

module.exports = {
  signup: async (username, password, sessionId) => {
    var hash = await bcrypt.hash(password, await bcrypt.genSalt(10), null)
    var queryRes = await queryBuilder.quickRun(userQueries.create, [ username, hash, sessionId ], 1)
    return queryRes
  },
  logout: async (sessionId) => {
    return await queryBuilder.quickRun(userQueries.logout, [ sessionId ])
  },
  findLogin: async (username, password) => {
    var user = await userService.findByName(username)
    if (user) {
      var foo = bcrypt.compare(password, user.password, (err, result) => {
        if (!result) { user = null }
      })
    }
    return user
  }
}
