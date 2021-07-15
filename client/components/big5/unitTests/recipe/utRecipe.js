cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    await cDI.components.unitTests.recipe.editCard($(".recipeCard[recipeid = 1]"))
  },
  editCard: async (card) => {
    var editButton = card.find(".recipeEdit")
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
  runAllCerealTreats: async () => {
    var card = $(".recipeCard[recipeid = 1]")
    await cDI.components.unitTests.recipe.editCard(card)

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

    await cDI.components.unitTests.recipe.saveEdits(card)
  },
}
