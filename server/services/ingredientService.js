var db = require('../foundation/dbLogic')
var queryBuilder = require('query-builder')(db)
var ingredientQueries = require("../queries/recipe/ingredient/ingredientQueries")
var UoMQueries = require("../queries/recipe/shared/UoMQueries")
var substanceQueries = require("../queries/recipe/ingredient/substanceQueries")

module.exports = {
  createUoM: async (name) => {
    return await db.runQuery(UoMQueries.createUoM, [ name ], 1)
  },
  getAllUoMs: async (name) => {
    return await db.runQuery(UoMQueries.getAll)
  },
  findUoMsByName: async (name) => {
    var qb = queryBuilder.new()
    qb.insertQuery(UoMQueries.getByName)
    qb.insertParams(`%${name}%`, `%${name}%`, `%${name}%`)
    return qb.run()
  },

  createSubstance: async (name) => {
    return await db.runQuery(substanceQueries.createSubstance, [ name, name ], 1)
  },
  getAllSubstances: async (name) => {
    return await db.runQuery(substanceQueries.getAll)
  },
  findSubstancesByName: async (name) => {
    var qb = queryBuilder.new()
    qb.insertQuery(substanceQueries.getByName)
    qb.insertParams(`%${name}%`, `%${name}%`)
    return qb.run()
  },

  upsertIngredient: async (qb, UoMId, foodVariantId, substanceId, prepStyleId) => {
    return ingredientQueries.upsertIngredient(qb, UoMId, foodVariantId, substanceId, prepStyleId)
    // run
    //   ? await db.runQuery(ingredientQueries.updateSubstance, [ substanceId, recipe_ingredientId ])
    //   : ingredientQueries.updateSubstance
  },
}
