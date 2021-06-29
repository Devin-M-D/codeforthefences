var ss = require('../../../utils/sqlSnippets')
var toolModels = require('../../../models/recipe/tool')

var toolQueries = {}
toolQueries.selectToolObj =
`SELECT
  ${ss.projections(toolModels.recipe_tool)},
  ${ss.projections(toolModels.toolType)},
  ${ss.projections(toolModels.UoM)}
  FROM tool
  ${ss.join("tool", "toolType")}
  ${ss.lJoin("tool", "UoM")}`

toolQueries.getForRecipeSet = (recipeSetName, setName) => {
  setName = setName || "tmp_tool"
  var query =
`${ss.addSet(setName).body(`
  ${toolQueries.selectToolObj}
  ${ss.join("tool", "recipe_tool", "id", "toolId")}
  ${ss.join("recipe_tool", recipeSetName, "recipeId", "id")}
`)}
`
  return query
}

module.exports = toolQueries
