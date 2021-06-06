var ingredientModel = require('./graphIngredientModel')
var toolModel = require('./graphToolModel')

module.exports =   {
    recipe: {
      id: null,
      name: null,
      // ingredients: [ingredientModel],
      tools: [toolModel]
    }
  }
