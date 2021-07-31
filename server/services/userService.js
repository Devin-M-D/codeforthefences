var queryBuilder = require('../utils/queryBuilder')
var userQueries = require("../queries/user/userQueries")
var DI = require('../foundation/DICore')

module.exports = {
  getAll: async () => {
    return await queryBuilder.quickRun(userQueries.getAll)
  },
  findByName: async (username) => {
    return await queryBuilder.quickRun(userQueries.findByName, [`%${username}%`])
  },
  findById: async (id) => {
    return await queryBuilder.quickRun(userQueries.findById, [ id ])
  },
  findByLogin: async (username, password) => {
    return await queryBuilder.quickRun(userQueries.findByLogin, [ username, password ])
  },
  setSession: async (sessionId, id) => {
    return await queryBuilder.quickRun(userQueries.setSession, [ sessionId, DI.datetimes.utcNow(), id ])
  },
}
