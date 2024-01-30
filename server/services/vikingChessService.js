var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var vikingChessQueries = require("../queries/vikingChess/vikingChessQueries")


var vikingChessService = {}
vikingChessService.getGame = async (userId) => {
  var gameData = await queryBuilder.quickRun(vikingChessQueries.getGame, [userId, userId], 1)
  return gameData
}

module.exports = vikingChessService
