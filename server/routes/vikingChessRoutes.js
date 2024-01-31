var vikingChessService = require('../services/vikingChessService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  // router.post('/crud/vikingChess/c/', DI.rh.asyncRoute(async (req, res, next) => {
  // }))
  router.post('/crud/vikingChess/r/', DI.rh.asyncRoute(async (req, res, next) => {
    console.log("session", req.body.session)
    var gameData = await vikingChessService.getGame(req.body.session.userId)
    DI.rh.succeed(res, gameData)
  }))
  // router.post('/vikingChess/pollTurn/', DI.rh.asyncRoute(async (req, res, next) => {
  // }))
  // router.post('/vikingChess/submitTurn/', DI.rh.asyncRoute(async (req, res, next) => {
  // }))
}
