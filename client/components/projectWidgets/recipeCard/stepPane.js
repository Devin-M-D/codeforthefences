cDI.components.recipeCard.stepPane = {
  reload: async (card, editMode) => {
    return cDI.utils.wrapInPromise((f) => {
      var stepsPane = card.find(".cardSteps")
      stepsPane.fadeOut(400, () => {
        if (stepsPane.html() != "") card.find(".cardSteps").css("visibility", "hidden")
        cDI.components.recipeCard.stepPane.build(card, editMode)
        card.find(".cardSteps").css("visibility", "visible")
        stepsPane.fadeIn(400);
        f()
      })
    })
  },
  build: (card, editMode) => {
    var stepsPane = card.find(".cardSteps")
    var recipe = editMode ? card.data("editedrecipe") : card.data("recipe")
    var paneHtml = ``
    var sorted = recipe.steps.sort((a, b) => a.idx < b.stepIndex)

    stepsPane.html(`
      <span class="rows autoH algnSpread">
        <span class="autoH autoW bold">Steps</span>
        ${editMode ? `<span class="shpPlus" style="flex-basis: 200px;"></span>` : ""}
      </span>`)
    cDI.addAwaitableInput("click", card.find(".shpPlus"), async (e) => {
      var newStep = cDI.services.recipe.newStep(card.data("recipe").id, sorted[sorted.length - 1].stepIndex + 1)
      card.data("editedrecipe").steps.push(newStep)
      await cDI.components.recipeCard.stepPane.reload(card, 1)
    })
    sorted.forEach(step => {
      var stepHTML = `
        <span class="cardStep rows autoH algnSS">
          <span class="stepIdx autoH" style="flex-basis: 50px;">${step.stepIndex}.&nbsp;</span>
      `
      var currMaps = recipe.stepMaps.filter(x => x.recipe_stepId == step.id)
      if (editMode) {
        stepHTML += `<span contenteditable="true" class="txtStep step${step.stepIndex} autoH rounded plainTextbox" stepIndex="${step.stepIndex}">${step.text}</span>`
      }
      else {
        var filledStepText = cDI.components.recipeCard.stepPane.addIngredientsToStepText(step.text, currMaps, recipe.ingredients, recipe.tools)
        stepHTML += `<span class="fauxrder autoW autoH"><span class=" autoH autoW alignSS rounded" style="flex-basis:auto;">${filledStepText}</span></span>`
      }
      stepHTML += `</span>`
      paneHtml += stepHTML
    });
    stepsPane.append(paneHtml)
    cDI.addAwaitableInput("keydown", stepsPane.find("span[contenteditable='true']"), e => {
      $(e.target).addClass("beingEdited")
    })
    cDI.addAwaitableInput("keyup", stepsPane.find("span[contenteditable='true']"), async e => {
      return await cDI.sequencer.debounce("stepTest", () => {
        $(e.target).addClass("acceptingEdit")
        $(e.target).removeClass("beingEdited")
        setTimeout(() => { $(e.target).removeClass("acceptingEdit") }, 500)
        cDI.components.recipeCard.stepPane.acceptStepChange(card, $(e.target))
      }, 500)
    })
  },
  addIngredientsToStepText: (stepText, maps, ingredients, tools) => {
    if (stepText.indexOf("{i") != -1) { stepText = cDI.components.recipeCard.stepPane.addIngredientsToStep(ingredients, stepText, maps.filter(x => x.mapType == "ingredient")) }
    if (stepText.indexOf("{t") != -1) { stepText = cDI.components.recipeCard.stepPane.addToolsToSteps(tools, stepText, maps.filter(x => x.mapType == "tool")) }
    return stepText
  },
  addIngredientsToStep: (ingredients, stepText, maps) => {
    maps.forEach((map) => {
      stepText = stepText.replace(`{i}`, `<p class="stepIngredient">${ingredients.find(x => x.stepIndex == map.stepIndex).substanceName}</p>`)
    })
    return stepText
  },
  addToolsToSteps: (tools, stepText, maps) => {
    tools.forEach((tool, x) => {
      stepText = stepText.replace(`{t}`, `<p class="stepTool">${tool.toolTypeName.toLowerCase()}</p>`)
    })
    return stepText
  },
  acceptStepChange: (card, input) => {
    var stepIndex = input.attr("stepIndex")
    var editedStep = card.data("editedrecipe").steps.find(x => x.stepIndex == stepIndex)
    var origStep = card.data("recipe").steps.find(x => x.stepIndex == stepIndex)

    editedStep.edited = editedStep.edited || []
    var isNew = editedStep.edited.indexOf("new") == 0

    if (isNew || editedStep.text != input.html()) {
      editedStep.text = input.html()
      if (!isNew) {
        if (editedStep.edited.indexOf("text") == -1)  { editedStep.edited.push("text") }
      }
    }
    if (isNew || (origStep && editedStep.text == input.html())){
      editedStep.edited = editedStep.edited.filter(x => x != "text")
    }

    if (editedStep.edited.length == 0) { delete editedStep.edited }
  }
}
