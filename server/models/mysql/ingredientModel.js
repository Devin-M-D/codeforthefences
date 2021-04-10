var DI = require('../../foundation/DICore')
var db = require('../../foundation/dbLogic')

var ingredientModel = {
  getAllFoodTypes: async () => {
    return db.runQuery("SELECT * FROM foodType ORDER BY name LIMIT 100")
  },
  findFoodTypeByName: async (name) => {
    return db.runQuery("SELECT * FROM foodType WHERE name LIKE ? ORDER BY name LIMIT 100", [ `%${name}%` ])
  },
  createFoodType: async (name) => {
    return db.runQuery("INSERT INTO foodType (name) VALUES (?)", [ name ])
  }
}

module.exports = ingredientModel
