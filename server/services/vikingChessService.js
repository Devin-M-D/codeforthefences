var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var vikingChessQueries = require("../queries/vikingChess/vikingChessQueries")


var vikingChessService = {}
vikingChessService.getGame = async (userId) => {
  var gamedata = await queryBuilder.quickRun(vikingChessQueries.getGame, [userId, userId], 1)
  gamedata.gamestate = JSON.parse(gamedata.gamestate)
  return gamedata
}
vikingChessService.submitMove = async (userId, piece, newX, newY) => {
  var gamedata = await vikingChessService.getGame(userId)
  var gamestate = gamedata.gamestate
  var currSpace = gamestate[piece]
  var currX = currSpace.split(",")[0]
  var currY = currSpace.split(",")[1]
  if ((gamedata.player1 == userId && piece.indexOf("b") != -1)
    || (gamedata.player2 == userId && (piece.indexOf("k") != -1 || piece.indexOf("w") != -1))
  ) { throw ("Cannot move opponent's piece!") }
  if (newX == currX && newY == currY) { throw ("Cannot move to the same space!") }
  if (newX != currX && newY != currY) { throw ("Must move in a straight line!") }
  var newSpacePiece = vikingChessService.hasPiece(gamestate, newX, newY)
  if (newSpacePiece.length > 0) { throw ("Cannot move to occupied space!") }

  var xMove = newX - currX
  var yMove = newY - currY
  var jumpedPieces
  if (xMove > 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      return prop[1].split(",")[0] > currX && prop[1].split(",")[0] < newX && prop[1].split(",")[1] == currY
    })
  }
  if (xMove < 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      return prop[1].split(",")[0] < currX && prop[1].split(",")[0] > newX && prop[1].split(",")[1] == currY
    })
  }
  if (yMove > 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      return prop[1].split(",")[0] > currY && prop[1].split(",")[0] < newY && prop[1].split(",")[1] == currX
    })
  }
  if (yMove < 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      return prop[1].split(",")[0] < currY && prop[1].split(",")[0] > newY && prop[1].split(",")[1] == currX
    })
  }
  if (jumpedPieces.length > 0){ throw ("Cannot jump a piece!") }

  console.log("move is valid, checking captures")

  vikingChessService.determineCapture(gamedata, userId, piece, newX, newY)

  // gamestate[piece] = `${newX},${newY}`
  // var newGameData = await queryBuilder.quickRun(vikingChessQueries.saveGame, [JSON.stringify(gamestate), userId, userId], 1)
  return gamedata
}
vikingChessService.determineCapture = (gamedata, userId, activePiece, newX, newY) => {
  var spaces = []
  var westSpace, northSpace, eastSpace, southSpace
  // if (newX != 0) {
  //   westSpace = `${newX-1},${newY}`
  //   console.log("westSpace", westSpace)
  //   var westThreatened = vikingChessService.hasPiece(gamedata.gamestate, westSpace.split(",")[0], westSpace.split(",")[1])
  //   if (gamedata.player1 = userId && ) {
  //     var westThreatened = vikingChessService.hasPiece(gamedata.gamestate, westSpace.split(",")[0], westSpace.split(",")[1])
  //   }
  // }
  if (newX != 10) {
    var eastX = newX+1
    var eastY = newY
    console.log("eastSpace", `${eastX},${eastY}`)
    console.log(gamedata.gamestate.b13)
    var eastThreatened = vikingChessService.hasPiece(gamedata.gamestate, eastX, eastY)
    console.log("eastThreatened", eastThreatened)
    if (gamedata.player1 = userId && eastThreatened == "b") {
      var eastSandwich = vikingChessService.hasPiece(gamedata.gamestate, eastX + 1, newY)
    }
  }
  if (newY != 0) { northSpace = `${newX},${newY-1}` }
  if (newY != 10) { southSpace = `${newX},${newY+1}` }
  console.log("westThreatened", westThreatened)
  if (westThreatened){

  }

}
vikingChessService.hasPiece = (gamestate, xPos, yPos) => {
  return Object.entries(gamestate).filter(prop => {
    return prop[1].split(",")[0] == xPos && prop[1].split(",")[1] == yPos
  })
}
module.exports = vikingChessService
