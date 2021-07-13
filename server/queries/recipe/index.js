var ss = require('../../utils/sqlSnippets')
var recipeQueries = require('./recipeQueries')
var toolQueries = require('./tool/toolQueries')
var ingredientQueries = require('./ingredient/ingredientQueries')
var stepQueries = require('./step/stepQueries')
var stepMapsQueries = require('./step')

var recipeQueriesIndex = {}
recipeQueriesIndex.descendentTree =
`
${toolQueries.getForRecipeSet("tmp_recipe")}
${ingredientQueries.getForRecipeSet("tmp_recipe")}
${stepQueries.getForRecipeSet("tmp_recipe")}
${stepMapsQueries.getMapsForStepSet("tmp_step")}
`

recipeQueriesIndex.getByName = () => {
  return `
${recipeQueries.getByName()}
${recipeQueriesIndex.descendentTree}
`
}

recipeQueriesIndex.getById = () => {
  return `
${recipeQueries.getById()}
${recipeQueriesIndex.descendentTree}
`
}

recipeQueriesIndex.setIngredient = `UPDATE recipe_ingredient SET ingredientId = @ingId, quantity = ? WHERE id = ?;
SET @ingId = NULL;
`


module.exports =recipeQueriesIndex
