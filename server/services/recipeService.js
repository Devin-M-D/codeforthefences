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
    for (var x = 0; x < editedRecipe.ingredients.length; x++){
      var curr = editedRecipe.ingredients[x]
      console.log(curr)
      var data = await ingredientService.findMeasureOfFood(curr.recipeId, curr.quantity, curr.UoMName, curr.foodVariant, curr.name, curr.prepStyle)
      console.log(data)
    }
  }
}
