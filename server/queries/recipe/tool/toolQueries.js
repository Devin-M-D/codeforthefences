var queryBuilder = require('query-builder')(require('../../../foundation/dbLogic'))
var toolModels = require('../../../models/recipe/tool')

var toolQueries = {}
toolQueries.selectToolObj =
`SELECT
  ${queryBuilder.projections(toolModels.recipe_tool)},
  ${queryBuilder.projections(toolModels.toolType)},
  ${queryBuilder.projections(toolModels.UoM)}
  FROM tool
  ${queryBuilder.join("tool", "toolType")}
  ${queryBuilder.lJoin("tool", "UoM")}`

toolQueries.getForRecipeSet = (recipeSetName, setName) => {
  setName = setName || "tmp_tool"
  var query =
`${queryBuilder.addSet(setName).body(`
  ${toolQueries.selectToolObj}
  ${queryBuilder.join("tool", "recipe_tool", "id", "toolId")}
  ${queryBuilder.join("recipe_tool", recipeSetName, "recipeId", "id")}
`)}
`
  return query
}

module.exports = toolQueries
