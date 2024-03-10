var db = require('../foundation/dbLogic')
var blogQueries = require("../queries/blog/blogQueries")

module.exports = {
  getBlogById: async (id) => {
    return await db.runQuery(blogQueries.readById, [ id ], 1)
  },
  getBlogList: async () => {
    var data = await db.runQuery(blogQueries.getBlogList)
    console.log("data", data)
    return data
  }
}
