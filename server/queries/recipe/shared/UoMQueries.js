var UoMModel = require('../../../models/recipe/shared/UoMModel')

var UoMQueries = {}
UoMQueries.create = `INSERT IGNORE INTO UoM (name) VALUES (?); SELECT * FROM UoM WHERE name = ?`
UoMQueries.getAll = `SELECT * FROM UoM`,
UoMQueries.getByName = `SELECT * FROM UoM WHERE name LIKE ? OR abbreviation LIKE ? OR plural LIKE ?`

module.exports = UoMQueries
