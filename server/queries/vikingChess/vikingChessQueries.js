var vikingChessQueries = {}

vikingChessQueries.getGame = `SELECT * FROM vikingChess WHERE player1 = ? OR player2 = ?`
vikingChessQueries.saveGame = `UPDATE vikingChess SET gamestate = ? WHERE player1 = ? OR player2 = ?`

module.exports = vikingChessQueries
