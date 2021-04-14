var db = require('../foundation/dbLogic')
var recipeModel = require("../models/mysql/recipeModel")
var ingredientService = require('../services/ingredientService')

module.exports = {
  getAll: async () => {
    return await recipeModel.getAll()
  },
  createNew: () => {

  },
  saveEditedRecipe: async (editedRecipe) => {
    var origRecipe = await recipeModel.getFullById(editedRecipe.id)
    console.log(origRecipe.ingredients.find(x => x.idx == 0))
    console.log(editedRecipe.ingredients.find(x => x.idx == 0))
    for (var x = 0; x < editedRecipe.ingredients.length; x++){
      var curr = editedRecipe.ingredients[x]
      //var data = await ingredientService.findMeasureOfFood(curr.recipeId, curr.quantity, curr.UoMName, curr.foodVariant, curr.name, curr.prepStyle)
    }
  }
}
