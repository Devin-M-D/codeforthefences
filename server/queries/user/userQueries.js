var userQueries = {}

userQueries.prjIdAndName = (tblAlias, idAlias, nameAlias) => {
  return `${tblAlias}.id AS ${idAlias}, ${tblAlias}.username AS ${nameAlias}`
}
userQueries.mapIdAndName = (id, username) => {
  return { id: id, username: username }
}
userQueries.selectBase = `SELECT * FROM user`

userQueries.getAll = `
${userQueries.selectBase}
LIMIT 10
`

userQueries.findByName = `
${userQueries.selectBase}
WHERE username = ?
`

userQueries.create = `
INSERT INTO user (username, password, sessionId) VALUES (?, ?, ?);
SELECT * FROM user WHERE id = LAST_INSERT_ID();
`

userQueries.setSession = `UPDATE user SET sessionId = ?, lastLogin = ? WHERE id = ?`
userQueries.getSession = `SELECT * FROM user WHERE sessionId = ?`

userQueries.logout = `UPDATE user SET sessionId = NULL, lastLogin = NULL WHERE sessionId = ?`

module.exports = userQueries
