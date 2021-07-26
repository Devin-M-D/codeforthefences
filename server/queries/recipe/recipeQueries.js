var ss = require('../../utils/sqlSnippets')
var recipeModels = require('../../models/recipe/recipeObjModel')

var recipeQueries = {}

recipeQueries.selectBase = `SELECT
${ss.projections(recipeModels.recipe, 0)}
FROM recipe`

recipeQueries.getAll = (setName) => {
  return `
${ss.addSet(setName || "tmp_recipe").body(`
${recipeQueries.selectBase}
ORDER BY name
LIMIT 10
`)}
`
}


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
WHERE recipe.id = ?
`)}
`
}

module.exports = recipeQueries
