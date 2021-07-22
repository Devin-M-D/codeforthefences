cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    var card = $(".recipeCard[recipeid = 1]")
    await cDI.components.unitTests.recipe.editCard(card)
    // await cDI.components.unitTests.recipe.addNewIng(card)
    // await cDI.components.unitTests.recipe.alterIngredient(card, 3, "Substance", "parsley")
    // await cDI.components.unitTests.recipe.alterIngredient(card, 3, "UoM", "large")
    // await cDI.components.unitTests.recipe.alterIngredient(card, 3, "Quantity", 1)

    await cDI.components.unitTests.recipe.addNewStep(card)
    await cDI.components.unitTests.recipe.alterStep(card, 3, "Test 3rd step text")

    await cDI.components.unitTests.recipe.saveEdits(card)
  },
  editCard: async (card) => {
    var editButton = card.find(".pencilBox")
    await cDI.awaitableInput("click", editButton)
  },

  //#region ingredients
  addNewIng: async (card) => {
    await cDI.awaitableInput("click", card.find(".cardIngs > span > .shpPlus"))
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
  alterIngredients: async (card) => {
    if (card.find(`.txtIngSubstance.Ing0`).val() == "butter"){
      await cDI.components.unitTests.recipe.alterIngredient(card, 0, "Substance", "parsley")
      await cDI.components.unitTests.recipe.alterIngredient(card, 0, "UoM", "cup")

      await cDI.components.unitTests.recipe.alterIngredient(card, 1, "UoM", "tablespoon")
      await cDI.components.unitTests.recipe.alterIngredient(card, 1, "Quantity", "4")

      await cDI.components.unitTests.recipe.alterIngredient(card, 2, "Substance", "sausage")
      await cDI.components.unitTests.recipe.alterIngredient(card, 2, "UoM", "large")
    }
    else {
      await cDI.components.unitTests.recipe.alterIngredient(card, 0, "Substance", "butter")
      await cDI.components.unitTests.recipe.alterIngredient(card, 0, "UoM", "tablespoon")

      await cDI.components.unitTests.recipe.alterIngredient(card, 1, "UoM", "cup")
      await cDI.components.unitTests.recipe.alterIngredient(card, 1, "Quantity", "1/4")

      await cDI.components.unitTests.recipe.alterIngredient(card, 2, "Substance", "cereal")
      await cDI.components.unitTests.recipe.alterIngredient(card, 2, "UoM", "cup")
    }
  },
  //#endregion

  //#region steps
  addNewStep: async (card) => {
    return await cDI.awaitableInput("click", card.find(".cardSteps > span > .shpPlus"))
  },
  alterStep: async (card, stepIndex, textVal) => {
    card.find(`.txtStep.step${stepIndex}`).html(textVal)
    return await cDI.awaitableInput("keyup", card.find(`.txtStep.step${stepIndex}`))
  },
  alterSteps: async (card, index, text) => {
    if (card.find(`.txtStep.step0`).html() == "Melt {i} in {t} over low heat"){
      return await cDI.components.unitTests.recipe.alterStep(card, 0, "Fling {i} at the wall using {t}")
    }
    else {
      return await cDI.components.unitTests.recipe.alterStep(card, 0, "Melt {i} in {t} over low heat")
    }
  },

  //#endregion

  saveEdits: async (card) => {
    var saveButton = card.find(".shpCheck")
    await cDI.awaitableInput("click", saveButton)
  },

  runAllCerealTreats: async (card) => {
    var card = $(".recipeCard[recipeid = 1]")
    await cDI.components.unitTests.recipe.editCard(card)

    await cDI.components.unitTests.recipe.alterIngredients(card)
    await cDI.components.unitTests.recipe.alterSteps(card)

    await cDI.components.unitTests.recipe.saveEdits(card)
  }

}
