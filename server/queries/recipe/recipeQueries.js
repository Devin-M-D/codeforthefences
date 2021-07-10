var ss = require('../../utils/sqlSnippets')
var recipeModels = require('../../models/recipe')

var recipeQueries = {}
recipeQueries.selectBase =
`
SELECT
${ss.projections(recipeModels.recipe, 0)}
FROM recipe`

recipeQueries.getByName = (setName) => {
  return `
${ss.addSet(setName || "tmp_recipe").body(`
${recipeQueries.selectBase}
WHERE recipe.name LIKE ?
`)}
`
}

recipeQueries.getById = (setName) => {
  return `
${ss.addSet(setName || "tmp_recipe").body(`
${recipeQueries.selectBase}
WHERE recipe.id LIKE ?
`)}
`
}

module.exports = recipeQueries
