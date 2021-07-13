cDI.components.recipeCard.stepPane = {
  createStepPane: async (card, editMode) => {
    var recipe = editMode ? card.data("editedrecipe") : card.data("recipe")
    var stepsPane = card.find(".cardSteps")
    var build = () => {
      var filledStepText = cDI.components.recipeCard.stepPane.getFilledSteps(recipe.steps, recipe.ingredients, recipe.tools, recipe.stepMaps)
      stepsPane.html(filledStepText)
    }

    if (editMode) {
      stepsPane.fadeOut(500, () => {
        build();
        stepsPane.fadeIn(500);
      })
    }
    else { build() }
  },
  getFilledSteps: (steps, ingredients, tools, stepMaps) => {
    var stepList = ``
    var currMaps
    steps.forEach((step, x) => {
      var stepText = step.text
      currMaps = stepMaps.filter(x => x.recipeStepId == step.id)
      if (step.text.indexOf("{i") != -1) { stepText = cDI.components.recipeCard.stepPane.addIngredientsToStep(ingredients, stepText, currMaps.filter(x => x.mapType == "ingredient")) }
      if (step.text.indexOf("{t") != -1) { stepText = cDI.components.recipeCard.stepPane.addToolsToSteps(tools, stepText, currMaps.filter(x => x.mapType == "tool")) }

      stepList += `
      <span class="cardStep rows unwrap">
        <span class="rowNumber">${x + 1})&nbsp;</span>
        <span class="displayBlock leftCopy">${stepText}</span>
      </span>`
    })
    return stepList
  },
  addIngredientsToStep: (ingredients, stepText, maps) => {
    maps.forEach((map) => {
      stepText = stepText.replace(`{i${map.barsIndex}}`, `<span class="stepIngredient">${ingredients.find(x => x.idx == map.recipeIndex).substanceName}</span>`)
    })
    return stepText
  },
  addToolsToSteps: (tools, stepText, maps) => {
    tools.forEach((tool, x) => {
      stepText = stepText.replace(`{t${x}}`, `<span class="stepTool">${tool.toolTypeName.toLowerCase()}</span>`)
    })
    return stepText
  }
}
