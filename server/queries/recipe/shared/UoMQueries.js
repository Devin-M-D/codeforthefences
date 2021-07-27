var ss = require('../../../utils/sqlSnippets')
var UoMModel = require('../../../models/recipe/shared/UoMmodel')

var UoMQueries = {}
UoMQueries.createUoM = `INSERT INTO UoM (name) VALUES (?); SELECT * FROM UoM WHERE id = LAST_INSERT_ID();`
UoMQueries.getAll = `SELECT * FROM UoM`,
UoMQueries.getByName = `SELECT * FROM UoM WHERE name LIKE ? OR abbreviation LIKE ? OR plural LIKE ?`

module.exports = UoMQueries
