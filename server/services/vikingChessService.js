var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var vikingChessQueries = require("../queries/vikingChess/vikingChessQueries")


var vikingChessService = {}
vikingChessService.getGame = async (userId) => {
  var gameData = await queryBuilder.quickRun(vikingChessQueries.getGame, [userId, userId], 1)
  return gameData
}
vikingChessService.submitMove = async (userId, piece, newX, newY) => {
  var gameData = await queryBuilder.quickRun(vikingChessQueries.getGame, [userId, userId], 1)
  console.log(gameData)
  var currState = JSON.parse(gameData.gamestate)
  currSpace = currState[piece]
  var currX = currSpace.split(",")[0]
  var currY = currSpace.split(",")[1]
  if (newX == currX || newY == currY){
    console.log("move is valid")
    currState[piece] = `${newX},${newY}`
  }
    var newGameData = await queryBuilder.quickRun(vikingChessQueries.saveGame, [JSON.stringify(currState), userId, userId], 1)
    return gameData
}
module.exports = vikingChessService
