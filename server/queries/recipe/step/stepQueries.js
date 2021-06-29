var ss = require('../../../utils/sqlSnippets')
var stepModels = require('../../../models/recipe/step')

module.exports = {
  getForRecipeSet: (recipeSetName, setName) => {
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
}
 
