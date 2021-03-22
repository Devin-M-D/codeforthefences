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
