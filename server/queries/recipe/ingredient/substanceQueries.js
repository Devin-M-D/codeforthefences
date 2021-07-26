module.exports = {
  getAll: `SELECT * FROM substance`,
  getByName: `SELECT * FROM substance WHERE name LIKE ?`,
  createSubstance: `INSERT IGNORE INTO substance (name) VALUES (?); SELECT * FROM substance WHERE name = ?;`
}
