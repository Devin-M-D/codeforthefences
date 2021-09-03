var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var stepObjQueries = require("../queries/recipe/step/stepObjQueries")
var stepQueries = require("../queries/recipe/step/stepQueries")

var stepService = {}
stepService.upsert = async (qb, text) => {
  return stepQueries.upsert(qb, text)
}
stepService.upsertStepMap = async (stepMap) => {
  var qb = queryBuilder.new()
  stepObjQueries.upsertStepMap(qb, stepMap.recipe_stepId, stepMap.stepMapTypeId, stepMap.barsIndex, stepMap.recipeIndex)
  console.log(qb.printRunnable())
  return await qb.run()
}
stepService.deleteStepMap = (qb, recipe_stepId) => {
  stepObjQueries.deleteStepMap(qb, recipe_stepId)
}
module.exports = stepService
