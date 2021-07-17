var db = require('../foundation/dbLogic')
var stepQueries = require("../queries/recipe/step/stepQueries")

var stepService = {}
stepService.upsert = async (qb, text) => {
  return stepQueries.upsert(qb, text)
}

module.exports = stepService
