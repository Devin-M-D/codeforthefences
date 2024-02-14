var userQueries = require('../user/userQueries')

var vikingChessQueries = {}

vikingChessQueries.getGame =
`SELECT vc.*
, ${userQueries.prjIdAndName("u", "player1Id", "player1Name")}
, ${userQueries.prjIdAndName("u2", "player2Id", "player2Name")}
FROM vikingChess vc
INNER JOIN user u ON u.id = vc.player1
INNER JOIN user u2 ON u2.id = vc.player2
WHERE player1 = ? OR player2 = ?`
vikingChessQueries.getCurrentTurn = `SELECT vc.turn FROM vikingChess vc WHERE id = ? and (player1 = ? OR player2 = ?)`
vikingChessQueries.saveGame = `UPDATE vikingChess SET ended = ?, winner = ?, gamestate = ?, turn = turn + 1 WHERE player1 = ? OR player2 = ?`

module.exports = vikingChessQueries
