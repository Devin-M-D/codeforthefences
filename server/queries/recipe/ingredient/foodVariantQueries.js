module.exports = {
  getAll: `SELECT * FROM foodVariant`,
  getByName: `SELECT * FROM foodVariant WHERE name LIKE ? OR abbreviation LIKE ?`,
  create: `INSERT IGNORE INTO foodVariant (name) VALUES (?); SELECT * FROM foodVariant WHERE name = ?;`
}
