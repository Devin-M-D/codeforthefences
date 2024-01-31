var queryBuilder = require('query-builder')(require('../../foundation/dbLogic'))
var userModel = require('../../models/shared/user/userModel')

var userQueries = {}

userQueries.selectBase = `SELECT
${queryBuilder.projections(userModel, 0)}
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

userQueries.setSession = `UPDATE user SET sessionId = ?, lastLogin = ? WHERE id = ?`
userQueries.getSession = `SELECT * FROM user WHERE sessionId = ?`

userQueries.logout = `UPDATE user SET sessionId = NULL, lastLogin = NULL WHERE sessionId = ?`

module.exports = userQueries
