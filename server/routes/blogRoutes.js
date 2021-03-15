module.exports = (DI) => {
  DI.router.post('/crud/blog/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.title){
      var data = await DI.data.rootQuery(`SELECT * FROM blogPost WHERE title = :title`, { title: req.body.title})
    }
    else {
      var data = await DI.data.rootQuery(`SELECT title, date FROM blogPost`)
    }
    DI.rh.succeed(res, data)
  }))
}
