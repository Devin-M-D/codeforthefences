var DI = require('../foundation/DICore')
var blogService = require("../services/blogService")

module.exports = (router) => {
  router.post('/crud/blog/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var data
    if (req.body.blogId) { data = await blogService.getBlogById(req.body.blogId) }
    else { data = await blogService.getBlogList() }
    DI.rh.succeed(res, data)
  }))
}
