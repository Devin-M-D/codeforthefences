var ss = require('../../utils/sqlSnippets')
var recipeQueries = require('./recipeQueries')
var toolQueries = require('./tool/toolQueries')
var ingredientQueries = require('./ingredient/ingredientQueries')
var stepQueries = require('./step/stepQueries')
var stepMapsQueries = require('./step')

module.exports = {
  getRecipeObjByName: () => {
    var query =
`
${recipeQueries.getByName()}
${toolQueries.getForRecipeSet("tmp_recipe")}
${ingredientQueries.getForRecipeSet("tmp_recipe")}
${stepQueries.getForRecipeSet("tmp_recipe")}
${stepMapsQueries.getMapsForStepSet("tmp_step")}
`
    return query
  }
}
