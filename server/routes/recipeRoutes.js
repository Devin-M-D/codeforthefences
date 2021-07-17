var db = require('../foundation/dbLogic')
var recipe = require('../services/recipeService')
var ingredientService = require('../services/ingredientService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  router.post('/crud/recipe/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var recipes = await recipe.getByName("cereal")
    DI.rh.succeed(res, recipes)
  }))
  router.post('/crud/recipe/u/', DI.rh.asyncRoute(async (req, res, next) => {
    var recipes = await recipe.saveEditedRecipe(req.body.editedRecipe)
    DI.rh.succeed(res, `Changes saved for recipe ${req.body.editedRecipe.id}`)
  }))

  router.post('/crud/UoM/c/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.newValue){
      var data = await ingredientService.createUoM(req.body.newValue)
    }
    DI.rh.succeed(res, data)
  }))
  router.post('/crud/UoM/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.searchString){
      var data = await ingredientService.findUoMsByName(req.body.searchString)
    }
    else {
      var data = await ingredientService.getAllUoMs()
    }
    DI.rh.succeed(res, data)
  }))

  router.post('/crud/substance/c/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.newValue){
      var data = await ingredientService.createSubstance(req.body.newValue)
    }
    DI.rh.succeed(res, data)
  }))
  router.post('/crud/substance/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.searchString){
      var data = await ingredientService.findSubstancesByName(req.body.searchString)
    }
    else {
      var data = await ingredientService.getAllSubstances()
    }
    DI.rh.succeed(res, data)
  }))
}
