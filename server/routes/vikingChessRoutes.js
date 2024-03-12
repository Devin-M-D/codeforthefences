var vikingChessService = require('../services/vikingChessService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  router.post('/crud/vikingChess/c/startNewGame', DI.rh.asyncRoute(async (req, res, next) => {
    try {
      var gameData = await vikingChessService.startNewGame(req.cookies["userId"], req.body.opponentName)
      DI.rh.succeed(res, gameData)
    }
    catch(ex){
      DI.rh.fail(res, JSON.stringify(ex))
    }
  }))
  router.post('/crud/vikingChess/r/getSingleUserGame', DI.rh.asyncRoute(async (req, res, next) => {
    try {
      var gameData = await vikingChessService.getSingleUserGame(req.body.gameId, req.cookies["userId"])
      DI.rh.succeed(res, gameData)
    }
    catch(ex){
      DI.rh.fail(res, JSON.stringify(ex))
    }
  }))
  router.post('/crud/vikingChess/r/allUserGames', DI.rh.asyncRoute(async (req, res, next) => {
    try{
      var gamesData = await vikingChessService.getAllUserGames(req.cookies["userId"])
      gamesData = vikingChessService.parseGamesMetadata(gamesData, req.cookies["userId"])
      DI.rh.succeed(res, gamesData)
    }
    catch(ex){
      DI.rh.fail(res, JSON.stringify(ex))
    }
  }))
  router.post('/vikingChess/pollTurn', DI.rh.asyncRoute(async (req, res, next) => {
    try{
      var turn = await vikingChessService.getCurrentTurn(req.body.gameId, req.cookies["userId"])
      DI.rh.succeed(res, turn)
    }
    catch(ex){
      DI.rh.fail(res, JSON.stringify(ex))
    }
  }))
  router.post('/vikingChess/submitMove/', DI.rh.asyncRoute(async (req, res, next) => {
    try {
      var gameData = await vikingChessService.submitMove(req.cookies["userId"], req.body.gameId, req.body.piece, req.body.newX, req.body.newY)
      DI.rh.succeed(res, gameData)
    }
    catch(ex) {
      DI.rh.fail(res, JSON.stringify(ex))
    }
  }))
}
