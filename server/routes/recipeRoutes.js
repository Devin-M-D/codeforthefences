var db = require('../foundation/dbLogic')
var recipeService = require('../services/recipeService')
var ingredientService = require('../services/ingredientService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  router.post('/crud/recipe/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var recipes = await recipeService.getAll()
    DI.rh.succeed(res, recipes)
  }))
  router.post('/crud/recipe/u/', DI.rh.asyncRoute(async (req, res, next) => {
    var recipes = await recipeService.saveEditedRecipe(req.body.editedRecipe)
    DI.rh.succeed(res, "foo")
  }))
  // router.post('/objectionTest/', DI.rh.asyncRoute(async (req, res, next) => {
  //   var food = await db()
  //   console.log(food)
  //   DI.rh.succeed(res, "foo")
  // }))
  // DI.router.post('/crud/UoM/r/', DI.rh.asyncRoute(async (req, res, next) => {
  //   if (req.body.name){
  //     var data = await DI.data.rootQuery(`SELECT * FROM UoM WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
  //   }
  //   else {
  //     var data = await DI.data.rootQuery(`SELECT * FROM UoM`)
  //   }
  //   DI.rh.succeed(res, data)
  // }))
  router.post('/crud/foodType/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.searchString){
      var data = await ingredientService.findFoodTypesByName(req.body.searchString)
    }
    else {
      var data = await ingredientService.getAllFoodTypes()
    }
    DI.rh.succeed(res, data)
  }))
  router.post('/crud/foodType/c/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.newValue){
      var data = await ingredientService.createFoodType(req.body.newValue)
    }
    DI.rh.succeed(res, data)
  }))
}
