var vikingChessModel = require('../../models/vikingChess/vikingChessModel')

var vikingChessQueries = {}

vikingChessQueries.getGame = `SELECT * FROM vikingChess WHERE player1 = ? OR player2 = ?`
vikingChessQueries.saveGame = `UPDATE vikingChess SET gamestate = ?, turn = turn + 1 WHERE player1 = ? OR player2 = ?`

var getGame2 = vikingChessModel
// vikingChessModel.where = vikingChessModel.
vikingChessQueries.getGame2 = getGame2

module.exports = vikingChessQueries
