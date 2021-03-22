var recipeModel = require("../models/mongo/recipeModel")

module.exports = (DI) => {
  return {
    getAll: async () => {
      // var toolType = new recipeModel.toolType({ name: "pan", description: "metal pan for stovetop"})
      // toolType = await toolType.save()
      //
      // var UoM = new recipeModel.UoM({ name: "Large", abbreviation: "lg"})
      // UoM = await UoM.save()
      //
      // var tool = new recipeModel.tool({ toolType: toolType._id, UoM: UoM._id})
      // tool = await tool.save()
      //
      // var recipe = new recipeModel.recipe({ name: "Cereal Treats", duration: 10, servings: "16 treats", tools: [
      //   tool._id
      // ]})
      // recipe = await recipe.save()


      // var recipeTool = new recipeModel.recipeTool({ name: "Cereal Treats", duration: 10, servings: "16 treats"})
      // recipeTool = await recipeModel.save()

      var recipe = await recipeModel.recipe.findOne().populate("tools").populate("tools.toolType").exec()

      console.log(recipe)
      console.log(recipe.tools)

    },
    createNew: () => {

    }
  }
}
