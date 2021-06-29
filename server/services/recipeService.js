var db = require('../foundation/dbLogic')
var recipeQueries = require("../queries/recipe")
// var ingredientService = require('../services/ingredientService')

module.exports = {
  getObjByName: async (name) => {
    var data = await db.runQuery(recipeQueries.getRecipeObjByName(), [`%${name}%`])
    var recipes = data[0]
    recipes.forEach(x => {
      x.tools = data[1].filter(y => y.recipeId = x.id)
      x.ingredients = data[2].filter(y => y.recipeId = x.id)
      x.steps = data[3].filter(y => y.recipeId = x.id)
      x.stepMaps = data[4].filter(y => y.recipeId = x.id)
    })
    return recipes
  },
  createNew: () => {

  },
  saveEditedRecipe: async (editedRecipe) => {
    // var origRecipe = await recipeModel.getFullById(editedRecipe.id)
    // console.log(origRecipe.ingredients.find(x => x.idx == 0))
    // console.log(editedRecipe.ingredients.find(x => x.idx == 0))
    // for (var x = 0; x < editedRecipe.ingredients.length; x++){
    //   var curr = editedRecipe.ingredients[x]
    //   //var data = await ingredientService.findMeasureOfFood(curr.recipeId, curr.quantity, curr.UoMName, curr.foodVariant, curr.name, curr.prepStyle)
    // }
  }
}
