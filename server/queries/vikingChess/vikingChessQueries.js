var vikingChessQueries = {}

vikingChessQueries.getGame = `SELECT * FROM vikingChess WHERE player1 = ? OR player2 = ?`

module.exports = vikingChessQueries
