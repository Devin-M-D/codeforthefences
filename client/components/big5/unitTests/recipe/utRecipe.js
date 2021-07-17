cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    var card = $(".recipeCard[recipeid = 1]")
    await cDI.components.unitTests.recipe.editCard(card)
    var res = await cDI.components.unitTests.recipe.alterSteps(card)
    await cDI.components.unitTests.recipe.saveEdits(card)
  },
  editCard: async (card) => {
    var editButton = card.find(".pencilBox")
    await cDI.awaitableInput("click", editButton)
  },
  setIngProp: async (card, index, prop, val) => {
    var input = await cDI.awaitableInput("click", card.find(`.txtIng${prop}.Ing${index}`))
    await cDI.awaitableInput("click", input.find(`:contains('${val}'):last`))
  },
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
  },
  alterIngredients: async (card) => {
    if (card.find(`.txtIngSubstance.Ing0`).val() == "butter"){
      await cDI.components.unitTests.recipe.setIngProp(card, 0, "Substance", "parsley")
      await cDI.components.unitTests.recipe.setIngProp(card, 0, "UoM", "cup")

      await cDI.components.unitTests.recipe.setIngProp(card, 1, "UoM", "tablespoon")
      await cDI.components.unitTests.recipe.setIngProp(card, 1, "Quantity", "4")

      await cDI.components.unitTests.recipe.setIngProp(card, 2, "Substance", "sausage")
      await cDI.components.unitTests.recipe.setIngProp(card, 2, "UoM", "large")
    }
    else {
      await cDI.components.unitTests.recipe.setIngProp(card, 0, "Substance", "butter")
      await cDI.components.unitTests.recipe.setIngProp(card, 0, "UoM", "tablespoon")

      await cDI.components.unitTests.recipe.setIngProp(card, 1, "UoM", "cup")
      await cDI.components.unitTests.recipe.setIngProp(card, 1, "Quantity", "1/4")

      await cDI.components.unitTests.recipe.setIngProp(card, 2, "Substance", "cereal")
      await cDI.components.unitTests.recipe.setIngProp(card, 2, "UoM", "cup")
    }
  },
  alterSteps: async (card) => {
    if (card.find(`.txtStep.step0`).html() == "Melt {i} in {t} over low heat"){
      card.find(`.txtStep.step0`).html("Fling {i} at the wall using {t}")
    }
    return await cDI.awaitableInput("keyup", card.find(`.txtStep.step0`))
  }
}
