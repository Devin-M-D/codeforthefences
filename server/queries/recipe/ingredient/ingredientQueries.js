var ss = require('../../../utils/sqlSnippets')
var ingredientModels = require('../../../models/recipe/ingredient')

var ingredientQueries = {}
ingredientQueries.selectIngObj =
` SELECT
  ${ss.projections(ingredientModels.ingredient)},
  ${ss.projections(ingredientModels.recipe_ingredient)},
  ${ss.projections(ingredientModels.quantity)},
  ${ss.projections(ingredientModels.UoM)},
  ${ss.projections(ingredientModels.foodVariant)},
  ${ss.projections(ingredientModels.substance)},
  ${ss.projections(ingredientModels.prepStyle)}
  FROM ingredient
  ${ss.join("ingredient", "quantity")}
  ${ss.lJoin("ingredient", "UoM")}
  ${ss.lJoin("ingredient", "foodVariant")}
  ${ss.join("ingredient", "substance")}
  ${ss.lJoin("ingredient", "prepStyle")}`

ingredientQueries.getForRecipeSet = (recipeSetName, setName) => {
  setName = setName || "tmp_ingredient"
  var query =
`${ss.addSet(setName).body(`
  ${ingredientQueries.selectIngObj}
  ${ss.join("ingredient", "recipe_ingredient", "id", "ingredientId")}
  ${ss.join("recipe_ingredient", recipeSetName, "recipeId", "id")}
`)}
`
  return query
}

module.exports = ingredientQueries
