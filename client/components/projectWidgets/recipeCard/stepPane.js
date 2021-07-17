cDI.components.recipeCard.stepPane = {
  createStepPane: async (card, editMode) => {
    var stepsPane = card.find(".cardSteps")

    if (editMode) {
      stepsPane.fadeOut(500, () => {
        stepsPane.html(cDI.components.recipeCard.stepPane.buildPane(card, editMode))
        stepsPane.fadeIn(500);
      })
    }
    else { stepsPane.html(cDI.components.recipeCard.stepPane.buildPane(card, editMode)) }
  },
  buildPane: (card, editMode) => {
    var recipe = editMode ? card.data("editedrecipe") : card.data("recipe")
    var paneHtml = ``
    var sorted = recipe.steps.sort((a, b) => a.idx < b.idx)
    // sorted = [...sorted, ...sorted, ...sorted, ...sorted, ]

    sorted.forEach(step => {
      var stepHTML = `
        <span class="cardStep rows autoH algnXS">
          <span class="stepIdx autoH" style="flex-basis: 50px;">${step.idx}.&nbsp;</span>
      `
      var currMaps = recipe.stepMaps.filter(x => x.recipeStepId == step.id)
      if (editMode) {
        stepHTML += `<span contenteditable="true" class="txtStep step${step.idx} autoH rounded">${step.text}</span>`
      }
      else {
        var filledStepText = cDI.components.recipeCard.stepPane.addIngredientsToStepText(step.text, currMaps, recipe.ingredients, recipe.tools)
        stepHTML += `<span class="fauxrder autoW autoH"><span class="alignSS rounded" style="flex-basis:auto;">${filledStepText}</span></span>`
      }
      stepHTML += `</span>`
      paneHtml += stepHTML
    });
    return paneHtml
  },
  addIngredientsToStepText: (stepText, maps, ingredients, tools) => {
    if (stepText.indexOf("{i") != -1) { stepText = cDI.components.recipeCard.stepPane.addIngredientsToStep(ingredients, stepText, maps.filter(x => x.mapType == "ingredient")) }
    if (stepText.indexOf("{t") != -1) { stepText = cDI.components.recipeCard.stepPane.addToolsToSteps(tools, stepText, maps.filter(x => x.mapType == "tool")) }
    return stepText
  },
  addIngredientsToStep: (ingredients, stepText, maps) => {
    maps.forEach((map) => {
      stepText = stepText.replace(`{i${map.barsIndex}}`, `<p class="stepIngredient">${ingredients.find(x => x.idx == map.recipeIndex).substanceName}</p>`)
    })
    return stepText
  },
  addToolsToSteps: (tools, stepText, maps) => {
    tools.forEach((tool, x) => {
      stepText = stepText.replace(`{t${x}}`, `<p class="stepTool">${tool.toolTypeName.toLowerCase()}</p>`)
    })
    return stepText
  },

}
