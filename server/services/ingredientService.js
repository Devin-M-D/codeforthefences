var ingredientQueries = require("../queries/recipe/ingredient/ingredientQueries")
var UoMQueries = require("../queries/recipe/shared/UoMQueries")
var substanceQueries = require("../queries/recipe/ingredient/substanceQueries")
var db = require('../foundation/dbLogic')

module.exports = {
  createUoM: async (name) => {
    return await db.runQuery(UoMQueries.createUoM, [ name ], 1)
  },
  getAllUoMs: async (name) => {
    return await db.runQuery(UoMQueries.getAll)
  },
  findUoMsByName: async (name) => {
    return await db.runQuery(UoMQueries.getByName, [ `%${name}%` ])
  },

  createSubstance: async (name) => {
    return await db.runQuery(substanceQueries.createSubstance, [ name ], 1)
  },
  getAllSubstances: async (name) => {
    return await db.runQuery(substanceQueries.getAll)
  },
  findSubstancesByName: async (name) => {
    return await db.runQuery(substanceQueries.getByName, [ `%${name}%` ])
  },

  upsertIngredient: async (qb, UoMId, foodVariantId, substanceId, prepStyleId) => {
    return ingredientQueries.upsertIngredient(qb, UoMId, foodVariantId, substanceId, prepStyleId)
    // run
    //   ? await db.runQuery(ingredientQueries.updateSubstance, [ substanceId, recipe_ingredientId ])
    //   : ingredientQueries.updateSubstance
  },
}
