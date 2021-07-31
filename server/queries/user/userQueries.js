var ss = require('../../utils/sqlSnippets')
var userModel = require('../../models/shared/user/userModel')

var userQueries = {}

userQueries.selectBase = `SELECT
${ss.projections(userModel, 0)}
FROM user`

userQueries.getAll = `
${userQueries.selectBase}
LIMIT 10
`

userQueries.findByName = `
${userQueries.selectBase}
WHERE username = ?
`

userQueries.create = `
INSERT INTO user (createdDate, username, password, sessionId) VALUES (NOW(), ?, ?, ?);
SELECT * FROM user WHERE id = LAST_INSERT_ID();
`

userQueries.login = `UPDATE user SET sessionId = NULL, lastLogin = NULL WHERE sessionId = ?`

userQueries.logout = `UPDATE user SET sessionId = NULL, lastLogin = NULL WHERE sessionId = ?`

module.exports = userQueries
