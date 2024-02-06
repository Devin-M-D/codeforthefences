// module.exports = {
//   tableName: "vikingChessModel",
//   fields: ["player1", "player2", "gamestate"],
//   aliases: ["player1", "player2", "gamestate"]
// }
var tblBase = () => { return { tableName: "user" } }
var userTable = tblBase()
userTable.createdDate = true
userTable.username = true
userTable.password = true
userTable.sessionId = true
userTable.lastLogin = true

var userName = tblBase()
userName.username = true

module.exports = {
  tableName: "vikingChess",
  player1: userName,
  player2: userName,
  turn: true,
  gamestate: true
}
