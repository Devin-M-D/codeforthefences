module.exports = {
  getAll: `SELECT * FROM prepStyle`,
  getByName: `SELECT * FROM prepStyle WHERE name LIKE ?`,
  create: `INSERT IGNORE INTO prepStyle (name) VALUES (?); SELECT * FROM prepStyle WHERE name = ?;`
}
