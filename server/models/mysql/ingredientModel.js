var DI = require('../../foundation/DICore')
var db = require('../../foundation/dbLogic')

var ingredientModel = {
  getAllFoodTypes: async () => {
    return db.runQuery("SELECT * FROM foodType")
  },
  findFoodTypeByName: async (name) => {
    return db.runQuery("SELECT * FROM foodType WHERE name LIKE ?", [ `%${name}` ])
  }
}

module.exports = ingredientModel
