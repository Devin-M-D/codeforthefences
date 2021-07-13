var ss = require('../../../utils/sqlSnippets')
var UoMModel = require('../../../models/recipe/shared/UoMmodel')

var UoMQueries = {}
UoMQueries.getAll = `SELECT * FROM UoM`,
UoMQueries.getByName = `SELECT * FROM UoM WHERE name LIKE ?`

module.exports = UoMQueries
