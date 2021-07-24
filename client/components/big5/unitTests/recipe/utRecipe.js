cDI.components.unitTests.recipe = {
  section: `recipe`,
  runAllRecipe: async () => {
    await cDI.components.unitTests.UTStartSection(cDI.components.unitTests.recipe.section, async () => {
      var card = $(".recipeCard[recipeid = 1]")
      // await cDI.components.unitTests.recipe.editAndCancel(card, 1)
      // await cDI.components.unitTests.recipe.editAndSave(card, 1)
      //await cDI.components.unitTests.recipe.addValidIngredientAndSave(card, 1)
      // await cDI.components.unitTests.recipe.removeIngredient(card, card.data("editedrecipe").ingredients.length - 1, 1)
      // await cDI.components.unitTests.recipe.addValidStepAndSave(card, 1)
      // await cDI.components.unitTests.recipe.addTwoStepsInOneEdit(card, 1)
      // await cDI.components.unitTests.recipe.removeStep(card, card.data("editedrecipe").steps.length - 1, 1)
      // await cDI.components.unitTests.recipe.removeStep(card, card.data("editedrecipe").steps.length - 1, 1)
      // await cDI.components.unitTests.recipe.removeStep(card, card.data("editedrecipe").steps.length - 1, 1)
    })
  },

  //#region edit/save/cancel
  editCard: async (card) => {
    var editButton = card.find(".shpPencil").parent()
    await cDI.awaitableInput("click", editButton)
  },
  saveEdits: async (card) => {
    var saveButton = card.find(".shpCheck").parent()
    return await cDI.awaitableInput("click", saveButton)
  },
  cancelEdits: async (card) => {
    var saveButton = card.find(".shpCancel").parent()
    await cDI.awaitableInput("click", saveButton)
  },
  editAndSave: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "editAndSave",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        return await cDI.components.unitTests.recipe.saveEdits(card)
      },
      async (res) => { return res == "No changes to save" }, log
    )
  },
  editAndCancel: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "editAndCancel",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.cancelEdits(card)
      },
      () => { return card.find(".shpPencil").length > 0 }, log)
  },
  //#endregion

  //#region ingredients
  addNewIng: async (card) => {
    await cDI.awaitableInput("click", card.find(".cardIngs > .ingTitle > .btnIcon > .shpPlus").parent())
  },
  alterIngredient: async (card, index, prop, val) => {
    if (prop == "Quantity"){
      var input = card.find(`.txtIng${prop}.Ing${index}`)
      input.html(val)
      await cDI.awaitableInput("keyup", input)
    }
    else  {
      var input = await cDI.awaitableInput("click", card.find(`.txtIng${prop}.Ing${index}`))
      await cDI.awaitableInput("click", input.find(`:contains('${val}'):last`))
    }
  },
  addIngredientAndSetAllValues: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "addIngredientAndSetAllValues",
      async () => {
        await cDI.components.unitTests.recipe.addNewIng(card)
        var newIndex = card.data("editedrecipe").ingredients.sort((a, b) => a < b)[card.data("editedrecipe").ingredients.length - 1].ingredientIndex
        await cDI.components.unitTests.recipe.alterIngredient(card, newIndex, "Substance", "parsley")
        await cDI.components.unitTests.recipe.alterIngredient(card, newIndex, "UoM", "large")
        await cDI.components.unitTests.recipe.alterIngredient(card, newIndex, "Quantity", 1)
      },
      (res) => { return true }
    )
  },
  addValidIngredientAndSave: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "addValidIngredientAndSave",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.addIngredientAndSetAllValues(card)
        var updatedRecipe = await cDI.components.unitTests.recipe.saveEdits(card)
        var newIngredient = updatedRecipe.ingredients.sort((a, b) => a.ingredientIndex < b.ingredientIndex)[updatedRecipe.ingredients.length - 1]
        return newIngredient
      },
      async (res) => { return res.substanceName == "parsley" }, log
    )
  },
  removeIngredient: async (card, index, log) => {
    await cDI.awaitableInput("click", card.find(`.cardIngredient[ingredientIndex=${index}]`).find(".shpMinus").parent())
  },
  //#endregion

  //#region steps
  addNewStep: async (card) => {
    return await cDI.awaitableInput("click", card.find(".cardSteps > .stepTitle > .btnIcon > .shpPlus").parent())
  },
  alterStep: async (card, stepIndex, textVal) => {
    card.find(`.txtStep[stepIndex=${stepIndex}]`).html(textVal)
    return await cDI.awaitableInput("keyup", card.find(`.txtStep[stepIndex=${stepIndex}]`))
  },
  addValidStepAndSave: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "editAndCancel",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.addNewStep(card)
        var newIndex = card.data("editedrecipe").steps.sort((a, b) => a < b)[card.data("editedrecipe").steps.length - 1].stepIndex
        await cDI.components.unitTests.recipe.alterStep(card, newIndex, "Test adding new step {i}, {t}")
        return await cDI.components.unitTests.recipe.saveEdits(card)
      },
      (res) => { return res.steps.length == 4 && res.steps.find(x => x.stepIndex == 3).text == "Test adding new step {i}, {t}" }, log)
  },
  addTwoStepsInOneEdit: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "addTwoStepsInOneEdit",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.addNewStep(card)
        await cDI.components.unitTests.recipe.addNewStep(card)
        var newIndex1 = card.data("editedrecipe").steps.sort((a, b) => a.stepIndex < b.stepIndex)[card.data("editedrecipe").steps.length - 2].stepIndex
        await cDI.components.unitTests.recipe.alterStep(card, newIndex1, "Test step 1")
        var newIndex2 = card.data("editedrecipe").steps.sort((a, b) => a.stepIndex < b.stepIndex)[card.data("editedrecipe").steps.length - 1].stepIndex
        await cDI.components.unitTests.recipe.alterStep(card, newIndex2, "Test step 2")
        return await cDI.components.unitTests.recipe.saveEdits(card)
      },
      // (res) => { return res.steps.length == 4 && res.steps.find(x => x.stepIndex == 3).text == "Test adding new step {i}, {t}" }, log)
      null, log)
  },
  removeStep: async (card, index, log) => {
      await cDI.awaitableInput("click", card.find(`.cardStep[stepIndex=${index}]`).find(".shpMinus").parent())
  }
  //#endregion
}
