module.exports = (DI) => {
  DI.router.post('/crud/users/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var data = await DI.rh.query(req, "SELECT * FROM user")
    DI.rh.succeed(res, data)
  }))
}
