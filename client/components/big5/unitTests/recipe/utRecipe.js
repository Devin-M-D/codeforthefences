cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    var recipeCard = $("[data-rid='#45:0']")
    var editButton = recipeCard.find(".recipeEdit")
    await cDI.awaitableInput("click", editButton)

    var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngFood.Ing1"))
    console.log(searchSelectPane)
    await cDI.awaitableInput("click", searchSelectPane.find(".btnClearInput"))
    await cDI.awaitableInput("click", searchSelectPane.find(".option1"))

    var saveButton = recipeCard.find(".shpCheck")
    await cDI.awaitableInput("click", saveButton)
  }
}
