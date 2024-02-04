var vikingChessService = require('../services/vikingChessService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  // router.post('/crud/vikingChess/c/', DI.rh.asyncRoute(async (req, res, next) => {
  // }))
  router.post('/crud/vikingChess/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var gameData = await vikingChessService.getGame(req.body.session.userId)
    DI.rh.succeed(res, gameData)
  }))
  // router.post('/vikingChess/pollTurn/', DI.rh.asyncRoute(async (req, res, next) => {
  // }))
  router.post('/vikingChess/submitMove/', DI.rh.asyncRoute(async (req, res, next) => {
    try {
      var gameData = await vikingChessService.submitMove(req.body.session.userId, req.body.piece, req.body.newX, req.body.newY)
      DI.rh.succeed(res, gameData)
    }
    catch(ex) {
      DI.rh.fail(res, ex)
    }
  }))
}
