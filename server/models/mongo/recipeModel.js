var mongoose = require("mongoose")
var Schema = mongoose.Schema

var recipeSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  servings: String,
  tools: [
    {type: Schema.Types.ObjectId, ref: 'tool'}
  ]
})
var recipeModel = mongoose.model('recipe', recipeSchema)

var toolTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
})
var toolTypeModel = mongoose.model('toolType', toolTypeSchema)

var UoMSchema = new mongoose.Schema({
  name: String,
  abbreviation: String,
})
var UoMModel = mongoose.model('UoM', UoMSchema)

var toolSchema = new mongoose.Schema({
  toolType: { type: Schema.Types.ObjectId, ref:'toolType', autopopulate: true },
  UoM: { type: Schema.Types.ObjectId, ref:'UoM', autopopulate: true },
})
var toolModel = mongoose.model('tool', toolSchema)

var recipeToolSchema = new mongoose.Schema({
  recipe: { type: Schema.Types.ObjectId, ref:'recipe', autopopulate: true },
  tool: { type: Schema.Types.ObjectId, ref:'tool', autopopulate: true },
  index: Number,
})
var recipeToolModel = mongoose.model('recipeTool', recipeToolSchema)

module.exports = {
  recipe: recipeModel,
  toolType: toolTypeModel,
  UoM: UoMModel,
  tool: toolModel,
  recipeTool: recipeToolModel,
}


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

    // var recipe = await recipeModel.recipe.findOne().populate("tools").populate("tools.toolType").exec()
    //
    // console.log(recipe)
    // console.log(recipe.tools)
