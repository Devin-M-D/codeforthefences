var queryBuilder = require('query-builder')(require('../../../foundation/dbLogic'))
var stepObjModels = require('../../../models/recipe/step/stepObjModel')

var stepQueries = {}
stepQueries.upsert = (qb, text) => {
  var query = `
SELECT @stepId:=id FROM step WHERE text = ?;
INSERT INTO step (text)
  SELECT ? WHERE @stepId IS NULL;
SET @stepId = (SELECT IFNULL(@stepId, LAST_INSERT_ID()));
`
  qb.insertQuery(query)
  qb.insertNonNullParams(text, text)
}

stepQueries.getForRecipeSet = (recipeSetName, setName) => {
  setName = setName || "tmp_step"
  var query =
`${queryBuilder.addSet(setName).body(`
SELECT
${queryBuilder.projections(stepObjModels.step, 0)},
${queryBuilder.projections(stepObjModels.recipe_step)}
FROM ${stepObjModels.step.tableName}
${queryBuilder.join(stepObjModels.step.tableName, "recipe_step", "id", "stepId")}
${queryBuilder.join("recipe_step", recipeSetName, "recipeId", "id")}
`)}
`
  return query
}

module.exports = stepQueries
