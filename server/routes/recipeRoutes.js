var db = require('../foundation/dbLogic')
var recipeService = require('../services/recipeService')
var ingredientService = require('../services/ingredientService')
var stepService = require('../services/stepService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  router.post('/crud/recipe/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var recipes = await recipeService.getAll()
    DI.rh.succeed(res, recipes)
  }))
  router.post('/crud/recipe/u/', DI.rh.asyncRoute(async (req, res, next) => {
    var updatedRecipe = await recipeService.saveEditedRecipe(req.body.editedRecipe)
    DI.rh.succeed(res, updatedRecipe)
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

  router.post('/crud/foodVariant/c/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.newValue){
      var data = await ingredientService.createFoodVariant(req.body.newValue)
    }
    DI.rh.succeed(res, data)
  }))
  router.post('/crud/foodVariant/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.searchString){
      var data = await ingredientService.findFoodVariantsByName(req.body.searchString)
    }
    else {
      var data = await ingredientService.getAllFoodVariants()
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

  router.post('/crud/prepStyle/c/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.newValue){
      var data = await ingredientService.createPrepStyle(req.body.newValue)
    }
    DI.rh.succeed(res, data)
  }))
  router.post('/crud/prepStyle/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.searchString){
      var data = await ingredientService.findPrepStylesByName(req.body.searchString)
    }
    else {
      var data = await ingredientService.getAllPrepStyles()
    }
    DI.rh.succeed(res, data)
  }))

  router.post('/crud/stepMap/u/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.stepMap){
      var data = await stepService.upsertStepMap(req.body.stepMap)
      DI.rh.succeed(res, data)
    }
    else {
      DI.rh.fail(res, "No step map supplied")
    }
  }))
}
