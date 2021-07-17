var ss = require('../../../utils/sqlSnippets')
var stepModels = require('../../../models/recipe/step')

var stepQueries = {}
stepQueries.upsert = (qb, text) => {
  var query = `
SELECT @stepId:=id FROM step
  WHERE text = ?;
INSERT INTO step (text)
  SELECT ? WHERE @stepId IS NULL;
SET @stepId = (SELECT IFNULL(@stepId, LAST_INSERT_ID()));
`
  qb.insertQuery(query)
  qb.insertFilteredParams(text, text)
}

stepQueries.getForRecipeSet = (recipeSetName, setName) => {
  setName = setName || "tmp_step"
  var query =
`${ss.addSet(setName).body(`
SELECT
${ss.projections(stepModels.step, 0)},
${ss.projections(stepModels.recipe_step)}
FROM ${stepModels.step.tableName}
${ss.join(stepModels.step.tableName, "recipe_step", "id", "stepId")}
${ss.join("recipe_step", recipeSetName, "recipeId", "id")}
`)}
`
  return query
}

module.exports = stepQueries
