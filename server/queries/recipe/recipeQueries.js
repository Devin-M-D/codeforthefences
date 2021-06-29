var ss = require('../../utils/sqlSnippets')
var recipeModels = require('../../models/recipe')

module.exports = {
  getByName: (setName) => {
    setName = setName || "tmp_recipe"
    var query =
`
${ss.addSet(setName).body(`
  SELECT
    ${ss.projections(recipeModels.recipe, 0)}
  FROM recipe
  WHERE recipe.name LIKE ?
`)}
`
    return query
  }
}
