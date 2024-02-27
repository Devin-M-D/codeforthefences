cDI.components.unitTests.recipe = {
  section: `recipe`,
  runAllRecipe: async () => {
    await cDI.components.unitTests.UTLogSection(cDI.components.unitTests.recipe.section, async () => {
      var card = $(".recipeCard[recipeid = 1]")
      // await cDI.components.unitTests.recipe.editAndCancel(card, 1)
      // await cDI.components.unitTests.recipe.editAndSave(card, 1)
      // await cDI.components.unitTests.recipe.addValidIngredientAndSave(card, 1)
      // await cDI.components.unitTests.recipe.editAndRemoveIngredient(card, card.data("recipe").ingredients.length - 1, 1)
      //
      // await cDI.components.unitTests.recipe.addTwoIngredientsInOneEdit(card, 1)
      // await cDI.components.unitTests.recipe.editAndRemoveIngredient(card, card.data("recipe").ingredients.length - 1, 1)
      // await cDI.components.unitTests.recipe.editAndRemoveIngredient(card, card.data("recipe").ingredients.length - 1, 1)
      //
      // await cDI.components.unitTests.recipe.addValidStepAndSave(card, 1)
      // await cDI.components.unitTests.recipe.editAndRemoveStep(card, card.data("recipe").steps.length - 1, 1)
      //
      // await cDI.components.unitTests.recipe.addTwoStepsInOneEdit(card, 1)
      // await cDI.components.unitTests.recipe.editAndRemoveStep(card, card.data("recipe").steps.length - 1, 1)
      // await cDI.components.unitTests.recipe.editAndRemoveStep(card, card.data("recipe").steps.length - 1, 1)

      // await cDI.components.unitTests.recipe.setStepMap(card, card.data("recipe").steps.length - 1, 0, 1, 1)
      // await cDI.components.unitTests.recipe.setStepMap(card, card.data("recipe").steps.length - 1, 0, 0, 1)
    })
  },

  //#region edit/save/cancel
  editCard: async (card) => {
    var editButton = card.find(".shpPencil").parent()
    await cDI.mockInput("click", editButton)
  },
  saveEdits: async (card) => {
    var saveButton = card.find(".shpCheck").parent()
    return await cDI.mockInput("click", saveButton)
  },
  cancelEdits: async (card) => {
    var saveButton = card.find(".shpCancel").parent()
    await cDI.mockInput("click", saveButton)
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
    await cDI.mockInput("click", card.find(".ingTitle > .btnIcon > .shpPlus").parent())
  },
  alterIngredient: async (card, index, prop, val) => {
    if (prop == "Quantity"){
      var input = card.find(`.txtIngQuantity[ingredientIndex="${index}"]`)
      input.html(val)
      await cDI.mockInput("keyup", input)
    }
    else  {
      var searchSelectPane = await cDI.mockInput("click", card.find(`.txtIng${prop}[ingredientIndex="${index}"]`))
      await cDI.mockInput("click", searchSelectPane.find(`:contains('${val}'):last`))
    }
  },
  addIngredientAndSetAllValues: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "addIngredientAndSetAllValues",
      async () => {
        await cDI.components.unitTests.recipe.addNewIng(card)
          var recipe = card.data("editedrecipe")
          await cDI.components.unitTests.recipe.alterIngredient(card, recipe.ingredients.length - 1, "Quantity", 1)
          if (card.data("editedrecipe").ingredients.find(x => x.substanceName == "parsley")) {
            await cDI.components.unitTests.recipe.alterIngredient(card, recipe.ingredients.length - 1, "Substance", "sausage")
            await cDI.components.unitTests.recipe.alterIngredient(card, recipe.ingredients.length - 1, "UoM", "pound")
          }
          else {
            await cDI.components.unitTests.recipe.alterIngredient(card, recipe.ingredients.length - 1, "Substance", "parsley")
            await cDI.components.unitTests.recipe.alterIngredient(card, recipe.ingredients.length - 1, "UoM", "large")
          }
      },
      (res) => { return true }, log
    )
  },
  addValidIngredientAndSave: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "addValidIngredientAndSave",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.addIngredientAndSetAllValues(card)
        var updatedRecipe = await cDI.components.unitTests.recipe.saveEdits(card)
        var newIngredient = updatedRecipe.ingredients.find(x => x.ingredientIndex == updatedRecipe.ingredients.length - 1)
        return newIngredient
      },
      async (res) => { return res.substanceName == "parsley" }, log
    )
  },
  addTwoIngredientsInOneEdit: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "addTwoIngredientsInOneEdit",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.addIngredientAndSetAllValues(card)
        await cDI.components.unitTests.recipe.addIngredientAndSetAllValues(card)
        var updatedRecipe = await cDI.components.unitTests.recipe.saveEdits(card)
        var newIngredients = updatedRecipe.ingredients.find(x => x.ingredientIndex == updatedRecipe.ingredients.length - 1 || x.ingredientIndex == updatedRecipe.ingredients.length - 2)
        return newIngredients
      },
      async (res) => { return true }, log
    )
  },
  removeIngredient: async (card, index, log) => {
    await cDI.mockInput("click", card.find(`.cardIngredient[ingredientIndex=${index}]`).find(".shpMinus").parent())
  },
  editAndRemoveIngredient: async (card, index, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "editAndRemoveIngredient",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.removeIngredient(card, index)
        return await cDI.components.unitTests.recipe.saveEdits(card)
      },
      (res) => { return true }, log
    )
  },
  //#endregion

  //#region steps
  addNewStep: async (card) => {
    return await cDI.mockInput("click", card.find(".stepTitle > .btnIcon > .shpPlus").parent())
  },
  alterStep: async (card, stepIndex, textVal) => {
    card.find(`.txtStep[stepIndex=${stepIndex}]`).html(textVal)
    return await cDI.mockInput("keyup", card.find(`.txtStep[stepIndex=${stepIndex}]`))
  },
  addValidStepAndSave: async (card, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "editAndCancel",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.addNewStep(card)
        await cDI.components.unitTests.recipe.alterStep(card, card.data("editedrecipe").steps.length - 1, "Test adding new step {i}, {t}")
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
        await cDI.components.unitTests.recipe.alterStep(card, card.data("editedrecipe").steps.length - 2, "Test step 1")
        await cDI.components.unitTests.recipe.alterStep(card, card.data("editedrecipe").steps.length - 1, "Test step 2")
        return await cDI.components.unitTests.recipe.saveEdits(card)
      },
      // (res) => { return res.steps.length == 4 && res.steps.find(x => x.stepIndex == 3).text == "Test adding new step {i}, {t}" }, log)
      null, log)
  },
  removeStep: async (card, index, log) => {
    await cDI.mockInput("click", card.find(`.cardStep[stepIndex=${index}]`).find(".shpMinus").parent())
  },
  editAndRemoveStep: async (card, index, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "editAndRemoveStep",
      async () => {
        await cDI.components.unitTests.recipe.editCard(card)
        await cDI.components.unitTests.recipe.removeStep(card, index)
        return await cDI.components.unitTests.recipe.saveEdits(card)
      },
      (res) => { return true }, log
    )
  },
  //#endregion

  //#region stepMaps
  setStepMap: async (card, stepIndex, barsIndex, ingredientIndex, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.recipe.section, "setStepMap",
      async () => {
        var stepMap = card.find(`.cardStep[stepIndex=${stepIndex}]`).find(`.stepIngredientMap[barsIndex=${barsIndex}]`)
        await cDI.mockInput("click", stepMap)
        var ingSelector = card.find(`.cardIngredient[ingredientIndex=${ingredientIndex}]`).find(".selector")
        await cDI.mockInput("click", ingSelector)
      },
      (res) => { return true }, log)
  },
  //#endregion
}
