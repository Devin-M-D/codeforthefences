var ss = require('../../../utils/sqlSnippets')
var stepModels = require('../../../models/recipe/step')

module.exports = {
  getMapsForStepSet: (stepSetName, setName) => {
    setName = setName || "tmp_stepMap"
    var query =
`
${ss.addSet(setName).body(`
  SELECT
    ${ss.projections(stepModels.stepMapType)},
    ${ss.projections(stepModels.stepMap)}
  FROM ${stepModels.stepMap.tableName}
  ${ss.join(stepModels.stepMap.tableName, stepModels.stepMapType.tableName)}
  WHERE ${stepModels.stepMap.tableName}.recipeStepId IN (SELECT recipe_stepId FROM ${stepSetName})
`)}
`
    return query
  }
}
