var toolType = {
  tableName: "toolType",
  fields: ["name", "description"],
}

var UoM = {
  tableName: "UoM",
  fields: ["name", "abbreviation"],
}

var tool = {
  tableName: "tool",
}

var recipe_tool = {
  tableName: "recipe_tool",
  fields: ["toolIndex"],
}

var recipe = {
  tableName: "recipe",
  fields: ["name", "duration", "servings"],
  // MM_tools: tool,
  // _WHERE: [["name", "LIKE", "%treat%"]]
}

module.exports = {
  recipe: recipe,
  recipe_tool: recipe_tool,
  tool: tool,
  toolType: toolType,
  UoM: UoM
}
