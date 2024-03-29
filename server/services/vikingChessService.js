var DI = require("../foundation/DICore")
var db = require('../foundation/dbLogic')
var vikingChessQueries = require("../queries/vikingChess/vikingChessQueries")
var userQueries = require("../queries/user/userQueries")

var vikingChessService = {}
vikingChessService.startNewGame = async (userId, opponentName) => {
  var queryRes = await db.runQuery(vikingChessQueries.startNewGame, [userId, opponentName])
  var gamesdata = await vikingChessService.getSingleUserGame(queryRes.insertId, userId)
  return gamesdata
}
vikingChessService.getSingleUserGame = async (gameId, userId) => {
  var gamedata = await db.runQuery(vikingChessQueries.getSingleUserGame, [gameId, userId, userId], 1)
  gamedata.player1 = userQueries.mapIdAndName(gamedata.player1Id, gamedata.player1Name)
  gamedata.player2 = userQueries.mapIdAndName(gamedata.player2Id, gamedata.player2Name)
  gamedata.gamestate = JSON.parse(gamedata.gamestate)
  return gamedata
}
vikingChessService.getAllUserGames = async (userId) => {
  var gamesdata = await db.runQuery(vikingChessQueries.getAllUserGames, [userId, userId])
  return gamesdata
}
vikingChessService.parseGamesMetadata = (gamesdata, userId) => {
  var parsed = gamesdata.map(x => {
    return {
      id: x.id,
      player1: x.player1,
      player2: x.player2,
      turn: x.turn,
      ended: x.ended,
      winner: x.winner,
      opponentName: x.player1 == userId ? x.player2Name : x.player1Name,
      p1Caps: Object.entries(JSON.parse(x.gamestate)).filter(piece => {
        return vikingChessService.isAttackerPiece(piece[0]) && piece[1] == "cap"
      }).length,
      p2Caps: Object.entries(JSON.parse(x.gamestate)).filter(piece => {
        return vikingChessService.isDefenderPiece(piece[0]) && piece[1] == "cap"
      }).length
    }
  })
  return parsed
}
vikingChessService.isDefenderPiece = (pieceName) => {
  if (pieceName.indexOf("k") != -1 || pieceName.indexOf("w") != -1) { return true }
  else if (pieceName.indexOf("b") != -1) { return false }
}
vikingChessService.isAttackerPiece = (pieceName) => {
  if (pieceName.indexOf("k") != -1 || pieceName.indexOf("w") != -1) { return false }
  else if (pieceName.indexOf("b") != -1) { return true }
}

vikingChessService.getCurrentTurn = async (gameId, userId) => {
  var currentTurn = (await db.runQuery(vikingChessQueries.getCurrentTurn, [gameId, userId, userId], 1)).turn
  return currentTurn
}
vikingChessService.submitMove = async (userId, gameId, piece, newX, newY) => {
  // console.log(`Moving ${piece} to ${newX}, ${newY}`)
  var gamedata = await vikingChessService.getSingleUserGame(gameId, userId)
  var gamestate = gamedata.gamestate
  var currSpace = gamestate[piece]
  var currX = currSpace.split(",")[0]
  var currY = currSpace.split(",")[1]

  //basic checks
  if ((gamedata.player1.id == userId && piece.indexOf("b") != -1)
    || (gamedata.player2.id == userId && (piece.indexOf("k") != -1 || piece.indexOf("w") != -1))
  ) { throw ("Cannot move opponent's piece!") }
  if (newX == currX && newY == currY) { throw ("Cannot move to the same space!") }
  if (newX != currX && newY != currY) { throw ("Must move in a straight line!") }
  var newSpacePiece = vikingChessService.hasPiece(gamestate, newX, newY)
  if (DI.utils.isDef(newSpacePiece)) { throw ("Cannot move to occupied space!") }

  //jump checks
  var xMove = newX - currX
  var yMove = newY - currY
  var jumpedPieces
  if (xMove > 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      var jumpX = +prop[1].split(",")[0]
      return prop[1] != "cap" && currX < jumpX && jumpX < newX && prop[1].split(",")[1] == currY
    })
  }
  if (xMove < 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      var jumpX = +prop[1].split(",")[0]
      return prop[1] != "cap" && currX > jumpX && jumpX > newX && prop[1].split(",")[1] == currY
    })
  }
  if (yMove > 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      var jumpY = +prop[1].split(",")[1]
      return prop[1] != "cap" && currY < jumpY && jumpY < newY && prop[1].split(",")[0] == currX
    })
  }
  if (yMove < 0) {
    jumpedPieces = Object.entries(gamestate).filter(prop => {
      var jumpY = +prop[1].split(",")[1]
      return prop[1] != "cap" && currY > jumpY && jumpY > newY && prop[1].split(",")[0] == currX
    })
  }
  if (jumpedPieces.length > 0){ throw ("Cannot jump a piece!") }

  if (piece == "k" && vikingChessService.isCornerSpace(newX, newY)) {
    gamedata.ended = 1
    gamedata.winner = 1
  }
  else {
    vikingChessService.determineCapture(gamedata, userId, piece, newX, newY)
  }
  gamestate[piece] = `${newX},${newY}`
  var newGameData = await vikingChessService.saveGameData(gamedata, userId)
  return newGameData
}
vikingChessService.saveGameData = async (gamedata, userId) => {
  var newGameData = await db.runQuery(vikingChessQueries.saveGame, [gamedata.ended, gamedata.winner, JSON.stringify(gamedata.gamestate), userId, userId])
  return newGameData
}
vikingChessService.hasPiece = (gamestate, xPos, yPos) => {
  var pieces = Object.entries(gamestate).filter(prop => {
    return prop[1].split(",")[0] == xPos && prop[1].split(",")[1] == yPos
  })
  if (pieces.length > 0) { return pieces[0] }
}
vikingChessService.isOpponentPiece = (gamedata, userId, piece) => {
  if (gamedata.player1.id == userId && piece.indexOf("b") != -1) { return true }
  else if (gamedata.player2.id == userId && piece.indexOf("b") == -1) { return true }
  return false
}
vikingChessService.isCornerSpace = (xVal, yVal) => {
  if ((xVal == 0 || xVal == 10) && (yVal == 0 || yVal == 10)) { return true }
  return false
}
vikingChessService.isKingSpace = (xVal, yVal) => {
  if (xVal == 5 && yVal == 5) { return true }
  return false
}
vikingChessService.determineCapture = (gamedata, userId, activePiece, newX, newY) => {
  var checkDir = (newXYval, axis, dir) => {
    var minMax = dir == 0 ? 0 : 10
    var incVal = dir == 0 ? -1 : 1
    if (newXYval != minMax) {
      var tmpX = axis == 0 ?  newXYval + incVal : newX
      var tmpY = axis == 1 ?  newXYval + incVal : newY
      var threatened = vikingChessService.hasPiece(gamedata.gamestate, tmpX, tmpY)
      var threatOnEdge = axis == 0 ? tmpX : tmpY
      if (DI.utils.isDef(threatened) && vikingChessService.isOpponentPiece(gamedata, userId, threatened[0]) && threatOnEdge != minMax) {
        var basicSandwich = false
        threatX = tmpX
        threatY = tmpY
        tmpX = axis == 0 ?  tmpX + incVal : newX
        tmpY = axis == 1 ?  tmpY + incVal : newY
        if (vikingChessService.isCornerSpace(tmpX, tmpY) && threatened[0] != "k"){
          basicSandwich = true
        }
        else if (vikingChessService.isKingSpace(tmpX, tmpY) && threatened[0] == "k"){
          basicSandwich = true
        }
        else {
          var sandwich = vikingChessService.hasPiece(gamedata.gamestate, tmpX, tmpY)
          if (DI.utils.isDef(sandwich) && !vikingChessService.isOpponentPiece(gamedata, userId, sandwich[0]) ) {
            basicSandwich = true
          }
        }
        if (basicSandwich && threatened[0] != "k") { gamedata.gamestate[threatened[0]] = "cap" }
        else if (basicSandwich && threatened[0] == "k"){
          var flanker1, flanker1X, flanker1Y, flanker2, flanker2X, flanker2Y

          if (axis == 0){
            flanker1X = threatX
            if (threatY != 0) { flanker1Y = threatY - 1 }
            flanker2X = threatX
            if (threatY != 10) { flanker2Y = threatY + 1 }
          }
          else {
            flanker1Y = threatY
            if (threatX != 0) { flanker1X = threatX - 1 }
            flanker2Y = threatY
            if (threatX != 10) { flanker2X = threatX + 1 }
          }
          flanker1 = vikingChessService.hasPiece(gamedata.gamestate, flanker1X, flanker1Y)
          flanker2 = vikingChessService.hasPiece(gamedata.gamestate, flanker2X, flanker2Y)
          if ((flanker1 || vikingChessService.isKingSpace(flanker1X, flanker1Y))
            && (flanker2 || vikingChessService.isKingSpace(flanker2X, flanker2Y))
          ){
            gamedata.gamestate[threatened[0]] = "cap"
            gamedata.ended = 1
            gamedata.winner = 2
          }
        }
      }
    }
  }
  checkDir(newX, 0, 0)
  checkDir(newX, 0, 1)
  checkDir(newY, 1, 0)
  checkDir(newY, 1, 1)
}
module.exports = vikingChessService
