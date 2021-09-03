var queryBuilder = require('query-builder')(require('../foundation/dbLogic'))
var blogQueries = require("../queries/blog/blogQueries")

module.exports = {
  getBlogById: async (id) => {
    return await queryBuilder.quickRun(blogQueries.readById, [ id ], 1)
  },
  getBlogList: async () => {
    return await queryBuilder.quickRun(blogQueries.getBlogList)
  }
}
