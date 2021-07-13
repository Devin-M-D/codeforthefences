module.exports = {
  getAll: `SELECT * FROM substance`,
  getByName: `SELECT * FROM substance WHERE name LIKE ?`,
  createSubstance: `INSERT INTO substance (name) VALUES (?); SELECT * FROM substance WHERE id = LAST_INSERT_ID();`
}
