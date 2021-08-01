var queryBuilder = require('../utils/queryBuilder')
var blogQueries = require("../queries/blog/blogQueries")

module.exports = {
  getBlogById: async (id) => {
    return await queryBuilder.quickRun(blogQueries.readById, [ id ], 1)
  },
  getBlogList: async () => {
    return await queryBuilder.quickRun(blogQueries.getBlogList)
  }
}
