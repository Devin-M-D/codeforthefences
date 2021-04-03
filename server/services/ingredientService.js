var ingredientModel = require("../models/mysql/ingredientModel")
var db = require('../foundation/dbLogic')

module.exports = {
  getAllFoodTypes: async (name) => {
    return await ingredientModel.getAllFoodTypes()
  },
  findFoodTypeByName: async (name) => {
    return await ingredientModel.findFoodTypeByName(name)
  }
}
