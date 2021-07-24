cDI.components.recipeCard.stepPane = {
  reload: async (card, editMode) => {
    return cDI.utils.wrapInPromise((f) => {
      var stepsPane = card.find(".cardSteps")
      stepsPane.fadeOut(200, () => {
        if (stepsPane.html() != "") card.find(".cardSteps").css("visibility", "hidden")
        cDI.components.recipeCard.stepPane.build(card, editMode)
        card.find(".cardSteps").css("visibility", "visible")
        stepsPane.fadeIn(200);
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
      <span class="stepTitle rows autoH algnSC">
        ${editMode ? `
        <span class="btnIcon" data-btnsize=55>
          <span class="shpPlus"></span>
        </span>` : ""}
        <span class="autoH autoW bold stepPaneTitle">Steps</span>
      </span>`)
    cDI.addAwaitableInput("click", card.find(".shpPlus").parent(), async (e) => {
      var newStep = cDI.services.recipe.newStep(card.data("recipe").id, sorted[sorted.length - 1].stepIndex + 1)
      card.data("editedrecipe").steps.push(newStep)
      await cDI.components.recipeCard.stepPane.reload(card, 1)
    })
    sorted.filter(x => !x.edited || !x.edited.includes("removed")).forEach(step => {
      var stepHTML = cDI.components.recipeCard.stepPane.createStepLine(recipe, step, editMode)
      stepsPane.append(stepHTML)
    });
    cDI.components.recipeCard.stepPane.addEditEvents(card, editMode)
  },
  createStepLine: (recipe, step, editMode) => {
    var stepHTML = `
      <span class="cardStep rows autoH algnSC" stepIndex="${step.stepIndex}" recipe_stepId="${step.recipe_stepId}">
        <span class="stepIdx autoH" style="flex-basis: 50px;">${step.stepIndex}.&nbsp;</span>
    `
    var currMaps = recipe.stepMaps.filter(x => x.recipe_stepId == step.id)
    if (editMode) {
      stepHTML += `<span contenteditable="true" class="txtStep autoH rounded" stepIndex="${step.stepIndex}">${step.text}</span>`
    }
    else {
      var filledStepText = cDI.components.recipeCard.stepPane.addIngredientsToStepText(step.text, currMaps, recipe.ingredients, recipe.tools)
      stepHTML += `<span class="stepText autoH autoW alignSS rounded">${filledStepText}</span>`
    }
    if (editMode) {
      stepHTML += `
        <span class="btnIcon" data-btnsize=55>
          <span class="shpMinus"></span>
        </span>`
    }
    stepHTML += `</span>`
    return stepHTML
  },
  addEditEvents: (card, editMode) => {
    if (editMode) {
      var stepsPane = card.find(`.cardSteps`)
      cDI.addAwaitableInput("click", card.find(`.cardSteps > .btnIcon > .shpMinus`).parent(), async e => {
        await cDI.components.recipeCard.stepPane.acceptRemoval(card, $(e.target).closest(".cardStep").attr("stepIndex"))
      })
      cDI.addAwaitableInput("keydown", stepsPane.find("span[contenteditable='true']"), async e => {
        cDI.effects.toastPulse(0, $(e.target), 1)
      })
      cDI.addAwaitableInput("keyup", stepsPane.find("span[contenteditable='true']"), async e => {
        var recipeId = $(e.target).closest(".recipeCard").data("recipe").id
        var stepIndex = $(e.target).closest(".cardStep").attr("stepIndex")
          cDI.effects.toastPulse(1, $(e.target), 1)
          cDI.components.recipeCard.stepPane.acceptStepChange(card, $(e.target))
      })
    }
    else {
      cDI.addAwaitableInput("click", card.find(`.cardSteps > .cardStep > .stepText > .stepIngredientMap`), async e => {
        var cardStep = $(e.target)
        var recipe_stepId = cardStep.parent().parent().attr("recipe_stepId")
        var barsIndex = cardStep.attr("barsIndex")
        cDI.components.modal.justDrawCurtain(card)
        card.find(`.cardIngredient`).addClass("settingStepMap")
        card.find(`.cardIngredient`).prepend(`<span class="selector"></span>`)

        cDI.addAwaitableInput("click", card.find(`.cardIngredient > .selector`), async e2 => {
          e2.stopPropagation()
          var ingSelector = $(e2.target)
          ingSelector.addClass("selected")
          var ingredientIndex = ingSelector.parent().attr("ingredientIndex")
          var stepMap = card.data("recipe").stepMaps.find(x => x.recipe_stepId == recipe_stepId && x.barsIndex == barsIndex && x.mapType == "ingredient")
          if (!stepMap) {
            stepMap = cDI.services.recipe.newStepMap("ingredient", recipe_stepId, barsIndex, ingredientIndex)
            card.data("recipe").stepMaps.push(stepMap)
          }
          else {
            stepMap.recipeIndex = ingredientIndex
          }
          await cDI.services.recipe.saveStepMap(stepMap)
          await cDI.components.recipeCard.stepPane.reload(card)
          card.find(`.cardIngredient > .selector`).remove()
          card.find(`.cardIngredient`).removeClass("settingStepMap")
          await cDI.components.modal.raiseCurtain(card)
        })
      })

      // cDI.addAwaitableInput("click", card.find(`.cardSteps > .cardStep > .stepText > .stepToolMap`), async e => {
      //   card.find(`.cardIng`).addClass("setStepMap")
      // })
    }
  },
  addIngredientsToStepText: (stepText, maps, ingredients, tools) => {
    if (stepText.indexOf("{i") != -1) { stepText = cDI.components.recipeCard.stepPane.addIngredientsToStep(ingredients, stepText, maps.filter(x => x.mapType == "ingredient")) }
    if (stepText.indexOf("{t") != -1) { stepText = cDI.components.recipeCard.stepPane.addToolsToSteps(tools, stepText, maps.filter(x => x.mapType == "tool")) }
    return stepText
  },
  addIngredientsToStep: (ingredients, stepText, maps) => {
    var barsIndex = 0
    while (stepText.indexOf("{i}") != -1) {
      var map = maps.find(x => x.barsIndex == barsIndex)
      if (map) {
        var ingredient = ingredients.find(x => x.ingredientIndex == map.recipeIndex)
        stepText = stepText.replace(`{i}`, `<p class="stepIngredientMap" barsIndex="${barsIndex}">${ingredient.substanceName}</p>`)
      }
      else {
        stepText = stepText.replace(`{i}`, `<p class="stepIngredientMap" barsIndex="${barsIndex}">{i${barsIndex}}</p>`)
      }
      barsIndex++
    }
    return stepText
  },
  addToolsToSteps: (tools, stepText, maps) => {
    var barsIndex = 0
    while (stepText.indexOf("{t}") != -1) {
      var map = maps.find(x => x.barsIndex == barsIndex)
      if (map) {
        var tool = tools.find(x => x.toolIndex == map.recipeIndex)
        stepText = stepText.replace(`{t}`, `<p class="stepToolMap" barsIndex="${barsIndex}">${tool.toolTypeName.toLowerCase()}</p>`)
      }
      else {
        stepText = stepText.replace(`{t}`, `<p class="stepToolMap" barsIndex="${barsIndex}">{t${barsIndex}}</p>`)
      }
      barsIndex++
    }
    return stepText
  },
  acceptStepChange: (card, input) => {
    var stepIndex = input.attr("stepIndex")
    var editedStep = card.data("editedrecipe").steps.find(x => x.stepIndex == stepIndex)
    var origStep = card.data("recipe").steps.find(x => x.stepIndex == stepIndex)

    editedStep.edited = editedStep.edited || []
    var isNew = editedStep.edited.includes("new")
    console.log(isNew)

    if (isNew || editedStep.text != input.html()) {
      editedStep.text = input.html()
      if (!isNew) {
        if (!editedStep.edited.includes("text"))  { editedStep.edited.push("text") }
      }
    }
    if (isNew || (origStep && origStep.text == input.html())){
      editedStep.edited = editedStep.edited.filter(x => x != "text")
    }

    if (editedStep.edited.length == 0) { delete editedStep.edited }
    console.log(cDI.utils.clone(editedStep))
    console.log(cDI.utils.clone(card.data("editedrecipe")))
  },
  acceptRemoval: async (card, index) => {
    var removedStep = card.data("editedrecipe").steps.find(x => x.stepIndex == index)
    removedStep.stepIndex = null
    removedStep.edited = removedStep.edited || []
    if (!removedStep.edited.includes("removed")){ removedStep.edited.push("removed") }

    card.data("editedrecipe").steps.forEach(x => {
      if (x.stepIndex > index && (!x.edited || !x.edited.includes("removed"))) {
        x.stepIndex = x.stepIndex - 1
        x.edited = x.edited || []
        if (!x.edited.includes("stepIndex")){ x.edited.push("stepIndex") }
      }
    });
    console.log(cDI.utils.clone(card.data("editedrecipe").steps))
    await cDI.components.recipeCard.stepPane.reload(card, 1)
  }

}
