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
    var sorted = recipe.steps.sort((a, b) => a.idx < b.idx)

    stepsPane.html(`
      <span class="rows autoH algnSpread">
        <span class="autoH autoW bold">Steps</span>
        <span class="shpPlus" style="flex-basis: 200px;"></span>
      </span>`)
    sorted.forEach(step => {
      var stepHTML = `
        <span class="cardStep rows autoH algnSS">
          <span class="stepIdx autoH" style="flex-basis: 50px;">${step.idx}.&nbsp;</span>
      `
      var currMaps = recipe.stepMaps.filter(x => x.recipeStepId == step.id)
      if (editMode) {
        stepHTML += `<span contenteditable="true" class="txtStep step${step.idx} autoH rounded plainTextbox" stepId="${step.id}">${step.text}</span>`
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
      stepText = stepText.replace(`{i}`, `<p class="stepIngredient">${ingredients.find(x => x.idx == map.recipeIndex).substanceName}</p>`)
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
    var id = input.attr("stepId")
    var step = card.data("editedrecipe").steps.find(x => x.id == id)
    step.edited = step.edited || []

    if (step.text != input.html()) {
      step.text = input.html()
      if (step.edited.indexOf("text") == -1)  { step.edited.push("text") }
    }
    else {
      step.edited = step.edited.filter(x => x != "text")
    }
    if (step.edited.length == 0) { delete step.edited }

    console.log(card.data("editedrecipe").steps)
  }
}
