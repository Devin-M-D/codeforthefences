var recipeService = require('../services/recipe')

module.exports = (DI) => {
  DI.router.post('/crud/recipe/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var data = await DI.data.rootQuery(recipeService.getAllRecipes.query)
    DI.rh.succeed(res, data)
  }))
  DI.router.post('/crud/recipe/u/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.recipe){
      console.log(req.body.recipe)
    }
    DI.rh.succeed(res, "reached /crud/recipe/u/")
  }))
  DI.router.post('/crud/UoM/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.name){
      var data = await DI.data.rootQuery(`SELECT * FROM UoM WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
    }
    else {
      var data = await DI.data.rootQuery(`SELECT * FROM UoM`)
    }
    succeed(res, data)
  }))
  DI.router.post('/crud/foodType/r/', DI.rh.asyncRoute(async (req, res, next) => {
    if (req.body.name){
      var data = await DI.data.rootQuery(`SELECT * FROM foodType WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
    }
    else {
      var data = await DI.data.rootQuery("SELECT * FROM foodType")
    }
    DI.rh.succeed(res, data)
  }))
}
