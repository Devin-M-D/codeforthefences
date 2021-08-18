var queryBuilder = require('query-builder')(require('../../foundation/dbLogic'))
var recipeModels = require('../../models/recipe/recipeObjModel')

var recipeQueries = {}

recipeQueries.selectBase = `SELECT
${queryBuilder.projections(recipeModels.recipe, 0)}
FROM recipe`

recipeQueries.getAll = (setName) => {
  return `
${queryBuilder.addSet(setName || "tmp_recipe").body(`
${recipeQueries.selectBase}
ORDER BY name
LIMIT 10
`)}
`
}


recipeQueries.getByName = (setName) => {
  return `
${queryBuilder.addSet(setName || "tmp_recipe").body(`
${recipeQueries.selectBase}
WHERE recipe.name LIKE ?
`)}
`
}

recipeQueries.getById = (setName) => {
  return `
${queryBuilder.addSet(setName || "tmp_recipe").body(`
${recipeQueries.selectBase}
WHERE recipe.id = ?
`)}
`
}

module.exports = recipeQueries
