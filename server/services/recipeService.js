var recipeModel = require("../models/mysql/recipeModel")
var db = require('../foundation/dbLogic')

module.exports = {
  getAll: async () => {
    return await recipeModel.getAll()
  },
  createNew: () => {

  },
  saveEditedRecipe: (editedRecipe) => {
    console.log(editedRecipe)
  }
}
