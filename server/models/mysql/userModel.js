module.exports = {
  create: `INSERT INTO user (username, password, sessionId) VALUES (?, ?, ?)`,
  findByName: `SELECT * FROM user WHERE username = ?`,
  findById: `SELECT * FROM user WHERE id = ?`,
  findByLogin: `SELECT * FROM user WHERE username = ? AND password = ?`,
  setSession: `UPDATE user SET sessionId = ?, lastLogin = ? WHERE id = ?`,
  logout: `SELECT * FROM user WHERE sessionId = ?`
}
