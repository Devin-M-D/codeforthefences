var ss = require('../../../utils/sqlSnippets')
var stepModels = require('../../../models/recipe/step/stepObjModel')

var stepObjQueries = {}
stepObjQueries.getMapsForStepSet = (stepSetName, setName) => {
  return `
${ss.addSet(setName || "tmp_stepMap").body(`
SELECT
  ${ss.projections(stepModels.stepMapType)},
  ${ss.projections(stepModels.stepMap)}
FROM ${stepModels.stepMap.tableName}
${ss.join(stepModels.stepMap.tableName, stepModels.stepMapType.tableName)}
WHERE ${stepModels.stepMap.tableName}.recipeStepId IN (SELECT recipe_stepId FROM ${stepSetName})
`)}
`
}
stepObjQueries.upsertStepMap = (qb, recipe_stepId, stepMapTypeId, barsIndex, recipeIndex) => {
  var query = `
SELECT @stepMapId:=id FROM stepMap WHERE recipeStepId = ? AND stepMapTypeId = ? AND barsIndex = ?;
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex)
  SELECT ?, ?, ?, ? WHERE @stepMapId IS NULL;
SET @stepMapId = (SELECT IFNULL(@stepMapId, LAST_INSERT_ID()));
UPDATE stepMap SET recipeIndex = ? WHERE id = @stepMapId
`
  qb.insertQuery(query)
  qb.insertParams(recipe_stepId, stepMapTypeId, barsIndex)
  qb.insertParams(recipe_stepId, stepMapTypeId, barsIndex, recipeIndex)
  qb.insertParam(recipeIndex)
}
stepObjQueries.deleteStepMap = (qb, recipe_stepId, stepMapTypeId, recipeIndex) => {
  qb.insertQuery(`DELETE FROM stepMap WHERE recipe_stepId = ?;`)
  qb.insertParams(recipe_stepId)
}
module.exports = stepObjQueries
