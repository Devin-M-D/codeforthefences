var queryBuilder = require('../utils/queryBuilder')
var userQueries = require("../queries/user/userQueries")

module.exports = {
  getAll: async () => {
    return await queryBuilder.quickRun(userQueries.getAll)
  },
  findByName: async (username) => {
    return await queryBuilder.quickRun(userQueries.findByName, [`${username}`], 1)
  },
  findById: async (id) => {
    return await queryBuilder.quickRun(userQueries.findById, [ id ])
  },
  setSession: async (sessionId, id) => {
    return await queryBuilder.quickRun(userQueries.setSession, [ sessionId, DI.datetimes.utcNow(), id ])
  },
}
