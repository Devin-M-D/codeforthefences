var queryBuilder = require('../utils/queryBuilder')
var userQueries = require("../queries/user/userQueries")

module.exports = {
  signup: async (username, password, sessionId) => {
    var queryRes = await queryBuilder.quickRun(userQueries.create, [ username, password, sessionId ])
    return queryRes[0]
  },
  logout: async (sessionId) => {
    return await queryBuilder.quickRun(userQueries.logout, [ sessionId ])
  }
}
